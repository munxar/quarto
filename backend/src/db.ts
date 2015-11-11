///<reference path="../../typings/tsd.d.ts"/>
//import {mkdir, exists} from "fs";

export function connect(dbname: string, fn) {

}

connect("./data", function(err, db) {
    console.log(err);
});