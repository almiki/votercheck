# votercheck #
Simple web service for searching and verifying voter registration info.

## Requirements ##
You'll need Python2.7. For the server you'll need flask and flask_restful.

## Importing data ##
Run db_import.py, passing it the source text file and the destination SQLite database file:
> python db_import.py --db=/path/to/voterdata.db --input=/path/to/data.txt

To only import 1000 records (for testing or whatever):
> python db_import.py --db=/path/to/voterdata.db --input=/path/to/data.txt --max=1000

## Running the server ##
Run web/server.py, passing it the SQLite database file:
> python server.py --db=/path/to/voterdata.db --port=1234

You probably have to run this from the /votercheck folder.
