import argparse
import collections
import itertools
import json
from scipy import stats
from math import radians, cos, sin, asin, sqrt
import matplotlib.pyplot as plt
import numpy as np

DataPoint = collections.namedtuple('DataPoint', ['lat', 'long', 'acc'])

def munge_data(data):
    return data['data'].values()

def calc_distance(all_measured, all_actual):
    distances = []
    for measured, actual in itertools.izip(all_measured, all_actual):
        lat_delta = measured.lat - actual.lat
        long_delta = measured.long - actual.long
        distance = lat_delta ** 2 + long_delta ** 2

        # Convert all to radians
        lon1, lat1, lon2, lat2 = map(radians, [measured.long, measured.lat,
                actual.long, actual.lat])

        # haversine formula
        dlon = lon2 - lon1
        dlat = lat2 - lat1
        a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
        c = 2 * asin(sqrt(a))

        m_distance = 6367 * c * 1000

        distances.append(m_distance)
    return distances

def plot_historgram(distances):
    hist, bin_edges = np.histogram(distances, bins=10, density=True)
    plt.bar(bin_edges[:-1], hist, width = (min(bin_edges) - max(bin_edges)) / 10)
    plt.xlim(min(bin_edges), max(bin_edges))
    plt.show()

def gen_stats(data):
    all_measured = []
    all_actual = []
    for record in data:
        measured = DataPoint(
            record['measured']['latitude'],
            record['measured']['longitude'],
            record['measured']['accuracy']
        )

        actual = DataPoint(
            record['location']['lat'],
            record['location']['long'],
            None
        )

        all_measured.append(measured)
        all_actual.append(actual)

    distances = calc_distance(all_measured, all_actual)

    # Remove outliers
    distances = [x for x in distances if x <= 10000]

    n, minmax, m, v, s, k = stats.describe(distances)
    print 'Distance errors (meters):'
    print """
        ==========================
        mean         %12.3f
        std dev      %12.3f
        skew         %12.3f
        kurtosis     %12.3f
        min          %12.3f
        max          %12.3f
        """ % (m, sqrt(v), s , k, minmax[0], minmax[1])

    plot_historgram(distances)

    return all_measured, all_actual

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('firebase_json')
    args = parser.parse_args()
    with open(args.firebase_json) as f:
        data = json.load(f)

    data = munge_data(data)
    gen_stats(data)


if __name__ == '__main__':
    main()
