import argparse
from collections import defaultdict
from copy import copy
import json

"""
Creates an array of stops, not grouped by line
"""
def parse_stops(data):
    stops = []
    for location in data:
        for stop, coords in location['stops'].iteritems():
            new_stop = {}
            new_stop['location'] = coords
            new_stop['name'] = location['name']
            new_stop['stationId'] = stop
            stops.append(new_stop)

    return stops

def group_stops(stops):
    grouped = defaultdict(list)
    for stop in stops:
        new_stop = copy(stop)
        line = stop['stationId'][0]
        number = stop['stationId'][1:]

        new_stop.pop('stationId', None)
        new_stop['number'] = number

        grouped[line].append(new_stop)
    return grouped

"""
Parses station.json into stops
"""
def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('subway_json')
    args = parser.parse_args()
    with open(args.subway_json) as f:
        data = json.load(f)

    stops = parse_stops(data)
    grouped = group_stops(stops)
    print json.dumps(grouped)

if __name__ == '__main__':
    main()
