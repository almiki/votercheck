import settings
import server
import sqlite3

if __name__ == "__main__":
    app = server.SearchApp(lambda: sqlite3.connect(settings.db, check_same_thread=False))
    app.start(settings.port)
