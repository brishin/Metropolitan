import argparse
import collections
import json

DataPoint = collections.namedtuple('DataPoint', ['lat', 'long', 'acc'])

def munge_data(data):
    return data['data'].values()

def gen_stats(data):
    all_measured = []
    all_actual = []
    for record in data:
        measured = DataPoint(
            record['measured']['lat'],
            record['measured']['long'],
            record['measured']['accuracy']
        )

        actual = DataPoint(
            record['location']['lat'],
            record['location']['long'],
            record['location']['accuracy']
        )

        all_measured.append(measured)
        all_actual.append(actual)

    return all_measured, all_actual

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('firebase_json')
    args = parser.parse_args()
    with open(args.firebase_json) as f:
        data = json.load(f)

    data = munge_data(data)


if __name__ == '__main__':
    main()
