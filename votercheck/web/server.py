from flask import Flask, send_from_directory
from flask_restful import Resource, Api
import sqlite3

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

            def get(self, query):
                c = self.db_conn.cursor()

                print("GET query: {}".format(query))

                parts = [p for p in query.replace(',', ' ').split(' ') if p]
                results = []

                if parts:
                    longest_part = max(parts, key=lambda p: len(p))

                    c.execute("SELECT id, first_name, middle_name, last_name, zip_code, DOB, voter_status, political_party, other_party, application_date, application_source FROM voters WHERE first_name=? OR last_name=?", (longest_part.upper(), longest_part.upper()))
                    results = [{"id": i,
                                "first_name": first,
                                "last_name": last,
                                "middle_name": middle[:1],
                                "dob": dob,
                                "zip": zip_code,
                                "status": status,
                                "party": party + ('' if not party2 else "({})".format(party2)),
                                "party2": party2,
                                "application_date": app_date,
                                "application_source": app_source}
                               for i, first, middle, last, zip_code, dob, status, party, party2, app_date, app_source in c.fetchall()]
                    results = [r for r in results if all(p.upper() == r['first_name'] or p.upper() == r['last_name'] for p in parts)]

                return {"query": query,
                        "matches": results}

        self.api.add_resource(Voters, '/voters/<string:query>')

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
