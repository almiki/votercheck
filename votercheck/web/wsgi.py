import settings
import server
import sqlite3

application = server.SearchApp(lambda: sqlite3.connect(settings.db, check_same_thread=False)).app
