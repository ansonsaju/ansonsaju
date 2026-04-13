const fs = require('fs');

function cubeToStl(xmin, ymin, zmin, xmax, ymax, zmax) {
    const facets = [
        // bottom
        [[0,0,-1], [xmin, ymin, zmin], [xmax, ymin, zmin], [xmax, ymax, zmin]],
        [[0,0,-1], [xmin, ymin, zmin], [xmax, ymax, zmin], [xmin, ymax, zmin]],
        // top
        [[0,0,1], [xmin, ymin, zmax], [xmin, ymax, zmax], [xmax, ymax, zmax]],
        [[0,0,1], [xmin, ymin, zmax], [xmax, ymax, zmax], [xmax, ymin, zmax]],
        // front
        [[0,-1,0], [xmin, ymin, zmin], [xmax, ymin, zmin], [xmax, ymin, zmax]],
        [[0,-1,0], [xmin, ymin, zmin], [xmax, ymin, zmax], [xmin, ymin, zmax]],
        // back
        [[0,1,0], [xmin, ymax, zmin], [xmin, ymax, zmax], [xmax, ymax, zmax]],
        [[0,1,0], [xmin, ymax, zmin], [xmax, ymax, zmax], [xmax, ymax, zmin]],
        // left
        [[-1,0,0], [xmin, ymin, zmin], [xmin, ymax, zmin], [xmin, ymax, zmax]],
        [[-1,0,0], [xmin, ymin, zmin], [xmin, ymax, zmax], [xmin, ymin, zmax]],
        // right
        [[1,0,0], [xmax, ymin, zmin], [xmax, ymin, zmax], [xmax, ymax, zmax]],
        [[1,0,0], [xmax, ymin, zmin], [xmax, ymax, zmax], [xmax, ymax, zmin]],
    ];
    
    let res = "";
    for (const [normal, v1, v2, v3] of facets) {
        res += `  facet normal ${normal[0].toFixed(6)} ${normal[1].toFixed(6)} ${normal[2].toFixed(6)}\n`;
        res += "    outer loop\n";
        res += `      vertex ${v1[0].toFixed(6)} ${v1[1].toFixed(6)} ${v1[2].toFixed(6)}\n`;
        res += `      vertex ${v2[0].toFixed(6)} ${v2[1].toFixed(6)} ${v2[2].toFixed(6)}\n`;
        res += `      vertex ${v3[0].toFixed(6)} ${v3[1].toFixed(6)} ${v3[2].toFixed(6)}\n`;
        res += "    endloop\n";
        res += "  endfacet\n";
    }
    return res;
}

let output = "solid sentinel\n";
output += cubeToStl(-5, -5, 2, 5, 5, 12);
output += cubeToStl(-9, -7, 0, -5, 7, 5);
output += cubeToStl(5, -7, 0, 9, 7, 5);
output += cubeToStl(-1, -1, 12, 1, 1, 14);
output += cubeToStl(-5, -2, 14, -0.5, 3, 18);
output += cubeToStl(0.5, -2, 14, 5, 3, 18);
output += "endsolid sentinel\n";

fs.writeFileSync('assets/prototypes/sentinel_v1.stl', output, 'utf8');
console.log("Fixed STL (UTF-8) generated.");
