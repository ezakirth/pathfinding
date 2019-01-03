table = {};
table.insert = function (arr, value) {
    arr.push(value);
};


function noSmooth() {};

function fill() {};

function font() {};

function strokeWidth() {};

function stroke() {};

function assetList() {};


function supportedOrientations() {};

function displayMode() {};

function readText() {};

function vec2(x, y) {
    this.x = x || 0;
    this.y = y || 0;
};
vec2.prototype.add = function (v) {
    if (v instanceof vec2) return new vec2(this.x + v.x, this.y + v.y, this.z + v.z);
    else return new vec2(this.x + v, this.y + v, this.z + v);
}
vec2.prototype.subtract = function (v) {
    if (v instanceof vec2) return new vec2(this.x - v.x, this.y - v.y, this.z - v.z);
    else return new vec2(this.x - v, this.y - v, this.z - v);
};
vec2.prototype.multiply = function (v) {
    if (v instanceof vec2) return new vec2(this.x * v.x, this.y * v.y, this.z * v.z);
    else return new vec2(this.x * v, this.y * v, this.z * v);
};
vec2.prototype.divide = function (v) {
    if (v instanceof vec2) return new vec2(this.x / v.x, this.y / v.y, this.z / v.z);
    else return new vec2(this.x / v, this.y / v, this.z / v);
};
vec2.prototype.dist = function (v) {
    var dx = v.x - this.x;
    var dy = v.y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
};
vec2.prototype.rotate = function (radians) {
    radians = radians * 180 / Math.PI;
    var x = this.x * Math.cos(radians) - this.y * Math.sin(radians);
    var y = this.x * Math.sin(radians) + this.y * Math.cos(radians);
    return new vec2(this.x, this.y);
};
vec2.prototype.normalize = function () {
    return new vec2(this.x / (Math.sqrt(this.x * this.x + this.y * this.y)), this.y / (Math.sqrt(this.x * this.x + this.y * this.y)));
}

function background() {};

function sprite() {};

function sound() {};

function pushMatrix() {};

function popMatrix() {};

function translate() {};

function rect() {};

function fontSize() {};

function text() {};

function image() {};

function music() {};

function rotate() {};

function tint() {};

function mesh() {};
mesh.prototype.addRect = function () {};
mesh.prototype.setRect = function () {};
mesh.prototype.setRectColor = function () {};
mesh.prototype.setRectTex = function () {};
mesh.prototype.draw = function () {};


var DeltaTime = 0;
var ElapsedTime = 0;

var LANDSCAPE_ANY = 'LANDSCAPE_ANY';
var FULLSCREEN = 'FULLSCREEN';
var TEXT = 'TEXT';
var HEIGHT = 768;
var WIDTH = 1024;
var ENDED = 'ENDED';
var BEGAN = 'BEGAN';