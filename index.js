var walker = require('walker');

module.exports = function(dir) {
    var TREE = {},
        curr = {},
        root = {},
        dirObj = {},
        prevDirObj = {},
        fileObj = {};
    TREE.ID = 0;

    TREE.dir = function(name) {
        this.id = TREE.ID++;
        this.name = name;
        this.type = 'D';
        this.children = [];
    };
    TREE.dir.prototype = {
        constructor: TREE.dir,
        addChild: function(childObj) {
            this.children.push(childObj);
        },
        getChildren: function() {
            return this.children;
        }
    };
    
    TREE.file = function(name) {
        this.id = TREE.ID++;
        this.name = name;
        this.type = 'F';
        this.parent = {};
    };
    TREE.file.prototype = {
        constructor: TREE.file,
        setParent: function(dirObj) {
            dirObj.addChild(this);
            this.parent = dirObj;
        },
        getParent: function() {
            return this.parent;
        }
    };
        
    walker(dir)
        .on('dir', function(entry, stat) {
            dirObj = new TREE.dir(entry);
            if (entry === dir) {
                root = dirObj;
            }
            Object.keys(prevDirObj).length && prevDirObj.addChild(dirObj);
            prevDirObj = dirObj;
        })
        .on('file', function(file, stat) {
            var fileObj = new TREE.file(file);
            fileObj.setParent(dirObj);
        })
        .on('error', function(er, entry, stat) {
            console.log('Got error ' + er + ' on entry ' + entry);
        })
        .on('end', function() {
            root && console.log(root.name);

            function traversal(dirObj) {
                dirObj.children.map(function(child) {
                    child.type === 'F' ? console.log(child.name) : callTraversal(child);
                });
            }

            function callTraversal(dirObj) {
                traversal(dirObj);
            }
            callTraversal(root);
        });
};
