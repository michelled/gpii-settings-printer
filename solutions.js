"use strict";

var infusion = require("infusion");
var $ = fluid.registerNamespace("jQuery");

var filename = process.argv[2];
var solutions = require(filename);
var configurationPaths = [
    "settingsHandlers.configuration.capabilitiesTransformations",
    "settingsHandlers.configs.capabilitiesTransformations",
    "settingsHandlers.configure.capabilitiesTransformations"
];

var transformToSettingsMap = {
    "fluid.transforms.arrayToSetMembership": "options",
    "fluid.transforms.valueMapper": "options",
    "fluid.transforms.condition": "outputPath"
};

function capabilitiesTransformations(solution) {
    var capabilitiesTransformations = {};

    fluid.each(configurationPaths, function (configPath) {
        var transformationsForPath = fluid.get(solution, configPath);
        if (transformationsForPath) {
            $.extend(true, capabilitiesTransformations, transformationsForPath);
        }
    });

    return capabilitiesTransformations;
}

function printSolutions(solutions) {
    fluid.each(solutions, printSolution);
}

function printSolution(solution, solutionName) {
    console.log(solutionName);
    var capTran = capabilitiesTransformations(solution);
    printSettingsNames(capTran);
    console.log("\n");
}

function printSettingsNames(capTran) {
    fluid.each(capTran, printSettingName);
}

function printSettingName(transformationSpec, settingName) {
    if (settingName !== "transform") {
        printFlatTransformationSettingName(settingName);
    } else {
        printSettingsNameFromTransformSpec(transformationSpec);
    }
}

function printFlatTransformationSettingName(settingName) {
    console.log("  " + settingName);
}

function printSettingsNameFromTransformSpec(transformationSpecs) {
    transformationSpecs = fluid.makeArray(transformationSpecs);
    fluid.each(transformationSpecs, function (transformationSpec) {
        var transformType = transformationSpec.type;
        var settingsHolderPath = transformToSettingsMap[transformType];
        if (!settingsHolderPath) {
            throw new Error("Holder path was not found for transform type: " + transformType);
        }

        var settings = fluid.get(transformationSpec, settingsHolderPath);
        if (typeof settings === "string") {
            printFlatTransformationSettingName(settings);
        } else {
            fluid.each(Object.keys(settings),printFlatTransformationSettingName);
        }
    });
}


printSolutions(solutions);
