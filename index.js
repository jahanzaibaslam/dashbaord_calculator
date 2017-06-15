'use strict';

var _ = require('lodash')

const findNode = function (data, currentNode) {
    if(!data.length || !currentNode) return null;

    let prevNode = {};
    let node = _.find(data, function (h, key) {
        if (currentNode.nodeid === h.nodeid && currentNode.timeperiod !== h.timeperiod) {
            currentNode.year = parseInt(currentNode.timeperiod.substring(0, 4));
            currentNode.period = currentNode.timeperiod.substring(4, 6);

            prevNode.year = parseInt(h.timeperiod.substring(0, 4));
            prevNode.period = h.timeperiod.substring(4, 6);

            if ((currentNode.year - 1) === prevNode.year && currentNode.period === prevNode.period) {
                // console.log(h)
                return h;
            } else {
                return null
            }
        }
    });
    return node;
}


const calculatePercent = function (currentvalue, historicalvalue) {
    if (Math.round(historicalvalue) !== 0) {
        var percent = (currentvalue - historicalvalue) / historicalvalue * 100;
        return percent === '-Infinity' || percent === 'Infinity' ? null : Math.round(percent);
    }
    return null;
}

// Function to mape node keys for final response
const nodeMapper = function(currentNode, keys) {
    let outputNode = {};
    _.map(keys, function(k) {
        outputNode[k.output] = currentNode[k.key];
    });
    return outputNode;
}

// Function to mape percentage on the basis of selected nodes
const percentMapper = function (currentNode, matchedNode, keys) {
    let percentObj = {}
    if (currentNode && matchedNode) {
        _.each(keys, function (k) {
            if(k.percentage) {
                percentObj[k.output + '_percent'] = calculatePercent(currentNode[k.key], matchedNode[k.key]);
            }
        });
    }
    return percentObj;
}


// Function to get rows total for each node.
const getRowTotal = function (currentNode, allTabKeys) {
    var allKeys = _.keys(currentNode);
    let rowTotal = 0;
    _.each(allKeys, function (k) {
        var tabKeyNode = _.filter(allTabKeys, {
          key: k,
          rowTotal: true
        });

        if (tabKeyNode.length > 0) {
          rowTotal += Math.round(currentNode[k]) || 0;
        }
      });

      return rowTotal;
}

module.exports = {
    calculatePercent: calculatePercent,
    findNode: findNode,
    percentMapper: percentMapper,
    getRowTotal: getRowTotal,
    nodeMapper: nodeMapper,
}
