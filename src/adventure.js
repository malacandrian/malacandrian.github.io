var go, look, examine, use, take;

function gameInit() {
    var curRoom, changeRoom, inventory, items, rooms, itemAction, randomRoom, randomString;

    inventory = {};

    //Performs arbitrary actions on arbitrary items in arbitrary locations
    //Item - the name of the item you're searching for
    //action - the name of the event to call on the item
    //test - The property to check to tell if the action should be performed
    itemAction = function (item, action, test) {
        var found, lists, output;

        //where to search for the items
        lists = [curRoom.items, inventory];

        if (item == "inventory") {
            output = "";
            for (invItem in inventory) {
                output += " - " + invItem + " \n";
            }
            return output;
        }
        else {
            //Function pointers are magic.
            for (var list in lists) {
                if (Object.keys(lists[list]).indexOf(item) >= 0) {
                    if (lists[list][item][test]()) {
                        return lists[list][item][action]();
                    }
                    else {
                        return item + " is not " + test;
                    }
                }
            }

            return "I cannot see " + item;

        }
    }

    examine = function (item) {
        return itemAction(item, "onExamine", "examinable");
    }

    take = function (item) {
        return itemAction(item, "onTake", "takeable");
    }

    use = function (item) {
        return itemAction(item, "onUse", "useable");
    }

    go = function (direction) {
        if (Object.keys(curRoom.directions).indexOf(direction) >= 0) {
            return curRoom.directions[direction]();
        }
        else {
            return "I cannot go " + direction;
        }
    }

    look = function () {
        var item, direction;
        var out = "";
        out += curRoom.onLook() + "\n";
        if (Object.keys(curRoom.items).length > 0) {
            out += "\nYou can see \n";
            for (item in curRoom.items) {
                out += " - " + item + "\n";
                out += curRoom.items[item].lookText + "\n";
            }
        }
        if (Object.keys(curRoom.directions).length > 0) {
            out += "\nYou can\n";
            for (direction in curRoom.directions) {
                out += " - go('" + direction + "')\n";
            }
        }

        return out;
    }

    changeRoom = function (room) {
        curRoom = room;
        return look();
    }

    randomString = function(lengthMin, lengthMax) {
        var length = Math.random() * (lengthMax - lengthMin) + lengthMin;
        return (Math.random()+1).toString(36).substring(0, length);
    }

    randomRoom = function () {
        var i, dirs, count;
        dirs = {};
        count = Math.ceil(Math.random() * 5)
        for(i = 0; i < count; i += 1) {
            dirs[randomString(3, 6)] = function () {
                return changeRoom(randomRoom());
            }
        }

        return {
            lookText: randomString(20,30),
            onLook: function() {
                return this.lookText;
            },
            items: {},

            directions: dirs
        }
    }

    //All the items in the game
    items = {
        API: {
            version: 1.4,
            lookText: "You think you might be able to read the API by typing \"examine('API')\"",

            verbs: ["look()","go('direction')","examine('item')","use('item')","take('item')"],

            examinable: function () { return true },
            takeable: function () { return (Object.keys(inventory).indexOf("API") < 0) },
            useable: function () { return false },

            onUse: function () {
                return "You cannot use this item";
            },

            onTake: function () {
                inventory.API = this;
                delete curRoom.items.API;
                curRoom.items.Key = items.Key;

                return "You put the API in your inventory, well done you.\n" +
                    "It seems quite a bit longer now you've picked it up.\n\n" +
                    "As you collect the reams of documentation, one sentance in particular catches your eye:\n" +
                    "You can see what you're carrying at any time by typing \"examine('inventory')\"\n\n" +
                    "As you pick up the reem a small Key falls out on to the floor";
            },

            onExamine: function () {
                var verb;

                output = "Natcs Quest API V" + this.version + "\n" +
               "Hello, and welcome to Natcs Quest, a text-based adventure game played entirely in your browser's Javascript console.\n" +
               "\n" +
               "All actions take the form of verb('noun')\n" +
               "For example, you might want to try \"take('API')\"\n\n";

                if(Object.keys(inventory).indexOf("API") >= 0) {
                    output += "The available verbs are:\n";
                    for (verb in this.verbs) {
                        output += " - " + this.verbs[verb] + "\n";
                    }
                    output += "You can check this at any time by typing \"Object.keys(window)\", or by examining this API\n";
                }

                return output;
            }
        },

        Key: {
            lookText: "",

            examinable: function () { return true; },
            takeable: function () { return (Object.keys(inventory).indexOf("Key") < 0) },
            useable: function () { return (Object.keys(inventory).indexOf("Key") >= 0) },

            onUse: function () {
                if (curRoom == rooms.init) {
                    rooms.init.southLocked = false;
                    delete inventory.Key;
                    return "The lock clicks, and the door swings gently open, revealing a room to the South. Fresh air wafts in through the door";
                }
                else {
                    return "You can't use that here";
                }
            },

            onTake: function () {
                inventory.Key = this;
                delete curRoom.items.Key;

                return "You got a Small Key! Use it to open a locked door. You can use the key only in this dungeon";
            },

            onExamine: function () {
                return "A small key. Use it to open doors.";
            }
        },

        Self: {
            lookText: "",

            examinable: function () { return true },
            takeable: function () { return false },
            useable: function () { return false },

            onExamine: function () {
                return "You stare so deeply into your navel that you worry you might get lost, or fall down that ravine.\n\n" +
                    "It dawns on you that you are merely an empty vessel, you have acheived nothing with your life, and have no distinct personality. You only seem to exist as a tabula rasa on which over people can project their hopes and dreams. The only thing that unsettles you more than this realisation is that you weren't in the least bit unsettled by it.\n\n" + 
                    "You resolve to do something with your life... Tomorrow";
            }
        }
    }

    //All the rooms in the game
    rooms = {
        init: {
            lookCount: 0,
            southLocked: true,
            onLook: function () {
                var output = "";
                output += "You are sat in a blank, featureless room.\n"
                if (this.lookCount == 0) {
                    output += "Sometimes you wonder why you open the Javascript console on random websites, but not today.\n" +
                        "For once, your curiosity has been rewarded\n";
                }
                this.lookCount += 1;

                if (Object.keys(this.items).indexOf("API") >= 0) {
                    output += "In the centre of the room sits a table piled high with reams of paper on which appears to be some archaic API.\n"
                }
                if (Object.keys(this.items).indexOf("Key") >= 0) {
                    output += "On the floor is a small Key.\n"
                }

                output += "\nTo the South is a " + (this.southLocked ? "locked" : "open") + " door.";
                return output;
            },

            items: {
                API: items.API
            },

            directions: {
                South: function () {
                    if (rooms.init.southLocked) {
                        return "The door is locked";
                    }
                    else {
                        return changeRoom(rooms.riverHut);
                    }
                }

            }
        },

        riverHut: {
            onLook: function () {
                return "You stand in the middle of a large field.\n" +
                    "To the North sits a small, unimaginative cottage\n" +
                    "There is a river flowing east-west \n" +
                    "Upstream there is a great tower filling the entire skybox";
            },

            items: {},

            directions: {
                North: function () {
                    return changeRoom(rooms.init);
                },

                West: function () {
                    return "You follow the river downstream.\n" +
                        "Something feels instinctively worng about starting a game by going left.\n" +
                        changeRoom(rooms.ravine);
                }
            }
        },

        ravine: {
            onLook: function () {
                return "The river runs west, off a cliff, and into a deep ravine. Words cannot describe the beauty that confronts your eyes as you watch the water billow down to the open maw of this chasm. It makes you more than a little introspective.\n" +
                    "There is a thin rocky path down the edge of the ravine you think you might be able to manage";
            },

            items: {
                Self: items.Self
            },
            directions: {
                East: function () {
                    return changeRoom(rooms.riverHut);
                },

                Down: function () {
                    return changeRoom(rooms.maze);
                }
            }
        },

        maze: {
            onLook: function () {
                return "YOU ARE IN A TWISTY MAZE OF LITTLE PASSAGES, ALL DIFFERENT.";
            },

            items: {},

            directions: {
                Back: function () {
                    return changeRoom(rooms.ravine);
                },

                Insane: function () {
                    return changeRoom(randomRoom());
                }
            }
        }

    }

        //Begin the adventure!
    console.log('( (    /|(  ___  )\\__   __/(  ____ \\(  ____ \\     /\\(  ___  )|\\     /|(  ____ \\(  ____ \\\\__   __/\n' +
                '|  \\  ( || (   ) |   ) (   | (    \\/| (    \\/    / /| (   ) || )   ( || (    \\/| (    \\/   ) (   \n' +
                '|   \\ | || (___) |   | |   | |      | (_____    / / | |   | || |   | || (__    | (_____    | |   \n' +
                '| (\\ \\) ||  ___  |   | |   | |      (_____  )  / /  | |   | || |   | ||  __)   (_____  )   | |   \n' +
                '| | \\   || (   ) |   | |   | |            ) | / /   | | /\\| || |   | || (            ) |   | |   \n' +
                '| )  \\  || )   ( |   | |   | (____/\\/\\____) |/ /    | (_\\ \\ || (___) || (____/\\/\\____) |   | |   \n' +
                '|/    )_)|/     \\|   )_(   (_______/\\_______)\\/     (____\\/_)(_______)(_______/\\_______)   )_(   ');

    console.log(changeRoom(rooms.init));

};