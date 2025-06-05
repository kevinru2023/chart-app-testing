import { describe, expect, test, beforeEach } from "vitest";
import { sortPoints } from "../../src/lib/sortPoints.ts";

describe("sorting data points",() =>{
    test("small positive x points", () =>{
        const points = [{x:2, y:5}, {x:1, y:7}, {x:6, y:4}, {x:4, y:5}];
        const sort = sortPoints(points);
        expect(sort).toEqual([{x:1, y:7}, {x:2, y:5}, {x:4, y:5},{x:6, y:4} ]);
    });

    test("large positive x points", () =>{
        const points = [{x:2150, y:5}, {x:1100, y:7}, {x:6707, y:4}, {x:4000, y:5}];
        const sort = sortPoints(points);
        expect(sort).toEqual([{x:1100, y:7}, {x:2150, y:5}, {x:4000, y:5},{x:6707, y:4} ]);
    });

    test("small negative x data points", () =>{
        const points = [{x:-2, y:5}, {x:-1, y:7}, {x:-6, y:4}, {x:-4, y:5}];
        const sort = sortPoints(points);
        expect(sort).toEqual([{x:-6, y:4},{x:-4, y:5}, {x:-2, y:5}, {x:-1, y:7} ]);
    });

    test("large negative x data points", () =>{
        const points = [{x:-2050, y:5}, {x:-1300, y:7}, {x:-6900, y:4}, {x:-4112, y:5}];
        const sort = sortPoints(points);
        expect(sort).toEqual([{x:-6900, y:4},{x:-4112, y:5}, {x:-2050, y:5}, {x:-1300, y:7} ]);
    });

    test("small decimal with positive x points", () =>{
        const points = [{x:0.0002, y:5}, {x:0.0001, y:7}, {x:0.0008, y:4}, {x:0.0007, y:5}];
        const sort = sortPoints(points);
        expect(sort).toEqual([ {x:0.0001, y:7}, {x:0.0002, y:5}, {x:0.0007, y:5}, {x:0.0008, y:4}]);
    });

    test("large decimal with positive x points", () =>{
        const points = [{x:0.787, y:5}, {x:0.790, y:7}, {x:0.101, y:4}, {x:0.110, y:5}];
        const sort = sortPoints(points);
        expect(sort).toEqual([ {x:0.101, y:4},  {x:0.110, y:5}, {x:0.787, y:5}, {x:0.790, y:7} ]);
    });

    test("small decimal with negative x points", () =>{
        const points = [{x:-0.0002, y:5}, {x:-0.0001, y:7}, {x:-0.0008, y:4}, {x:-0.0007, y:5}];
        const sort = sortPoints(points);
        expect(sort).toEqual([ {x:-0.0008, y:4}, {x:-0.0007, y:5}, {x:-0.0002, y:5}, {x:-0.0001, y:7} ]);
    });

    test("large decimal with negative x points", () =>{
        const points = [{x:-0.787, y:5}, {x:-0.790, y:7}, {x:-0.101, y:4}, {x:-0.110, y:5}];
        const sort = sortPoints(points);
        expect(sort).toEqual([ {x:-0.790, y:7}, {x:-0.787, y:5}, {x:-0.110, y:5}, {x:-0.101, y:4} ]);
    });

    
});


