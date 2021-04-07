"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.output = exports.input = void 0;
var language_data_1 = require("@nsis/language-data");
var codePages = [];
Object.keys(language_data_1.meta).forEach(function (key) {
    var codePage = language_data_1.meta[key].code_page;
    if (!isNaN(codePage) && !codePages.includes("CP" + codePage)) {
        codePages.push("CP" + codePage);
    }
});
var input = __spreadArray(__spreadArray([
    'ACP'
], codePages), [
    'OEM',
    'UTF8',
    'UTF16BE',
    'UTF16LE'
]);
exports.input = input;
var output = __spreadArray(__spreadArray([
    'ACP'
], codePages), [
    'OEM',
    'UTF16BE',
    'UTF16BEBOM',
    'UTF16LE',
    'UTF16LEBOM',
    'UTF8',
    'UTF8SIG'
]);
exports.output = output;
