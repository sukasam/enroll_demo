const cleanPath = path => {
    let cleanPath = path;
    if (path.charAt(0) === ".") {
        cleanPath = path.slice(1);
    }
    return cleanPath;
};
const buildAliases = aliases => {
    const basepath = process.cwd();
    let output = {};
    //prepend `basepath` to each alias
    for (let i in aliases) {
        if (aliases.hasOwnProperty(i)) {
            //it's habit to prepend a {.} remove it so paths works
            const path = cleanPath(aliases[i]);
            output[i] = `${basepath}${path}`;
        }
    }
    return output;
};
module.exports = buildAliases;
