from flask import Flask, send_from_directory
from flask_restful import Resource, Api
import sqlite3


SEARCH_LIMIT = 50


def _prettyfy_date(d):
    year = d[:4]
    month = d[4:6]
    day = d[6:]
    return "{}/{}/{}".format(year, month, day)


def _strip(s):
    if not s:
        return ''
    return s.strip()


class SearchApp(object):
    def __init__(self, db_conn_creator):
        self.app = Flask(__name__)
        self.api = Api(self.app)
        self.db_conn = None

        app = self

        class Voters(Resource):
            def __init__(self):
                if not app.db_conn:
                    app.db_conn = db_conn_creator()

                self.db_conn = app.db_conn

            def get(self, last, first, middle, zipcode, dob):
                c = self.db_conn.cursor()

                first = first.strip().upper()
                last = last.strip().upper()
                middle = middle.strip().upper()

                print("GET query: {}".format(",".join([last, first, middle, zipcode, dob])))

                c.execute("SELECT zip_code, voter_status, status_reason, purged_date, inactive_date, middle_name FROM voters WHERE first_name=? AND last_name=? AND zip_code=? AND DOB=?",
                          (first, last, zipcode[:5], dob))
                results = [{"first_name": first,
                            "last_name": last,
                            "middle_name": middle[:1],
                            "dob": _prettyfy_date(dob),
                            "zip": zip_code,
                            "status": _strip(status),
                            "status_why": _strip(status_reason) if _strip(status_reason) else 'NA',
                            "purged": _prettyfy_date(purged_date) if purged_date else 'NA',
                            "inactive": _prettyfy_date(inactive_date) if inactive_date else 'NA'}
                           for zip_code, status, status_reason, purged_date, inactive_date, middle_name in c.fetchall()
                           if (not middle_name) or (middle and middle[0] == middle_name[0])]

                return {"matches": results[:SEARCH_LIMIT],
                        "count": len(results)}

        self.api.add_resource(Voters, '/voterapi/search/<string:last>/<string:first>/<string:middle>/<string:zipcode>/<string:dob>')

        @self.app.route('/search.html')
        def search_page():
            return app.app.send_static_file('search.html')

        @self.app.route('/js/<path:p>')
        def send_js(p):
            return send_from_directory('static/js', p)

    def start(self, port, debug=False):
        self.app.run(port=port, debug=debug)


if __name__ == '__main__':
    import argparse

    p = argparse.ArgumentParser(description='Voter DB web server.')
    p.add_argument('-d', '--db', required=True, dest="db")
    p.add_argument('-p', '--port', required=True, dest="port", type=int)
    args = p.parse_args()

    conn_creator = lambda: sqlite3.connect(args.db, check_same_thread=False)
    app = SearchApp(conn_creator)
    app.start(args.port)
