/**
 * Pass init function to cells, actors
 * Add creatures to depths.
 * Translate to 2d
 * Pass app state & state to renders
 *
 * Would be cool to have a top-down view and a side view.
 * Would be really cool to be able to switch different perspectives.
 */

var _A_ = (function(_, M, E_, S_) {

  'use strict';

  var m1 = M.matrix();
  m1.generate([3, 5, 4], '~').put([1, 4, 2], S_.actor(buildPlan('fish')));
  console.log(m1.get('cells'));
  console.log(m1.pull([1, 4, 2]).render());


  function buildPlan(type) {
    switch (type) {
      case 'shark':
          //render
          //init
          //logic
          //sprite
        return {
          name: 'shark',
          sprite: S_.sprite({
            type:'shark',
            render: function(state) {
              console.log('depth is', state.point.x());
              return '^';
            }
          })
        };
      case 'fish':
        return {
          name: 'fish',
          sprite: S_.sprite({
            type:'fish',
            render: function() {
              return '>';
            }
          })
        };
      case 'jellyfish':
        return {
          name: 'jellyfish',
          sprite: S_.sprite({
            type:'jellyfish',
            render: function() {
              return '@';
            }
          })
        };
      case 'plankton':
        return {
          name: 'plankton',
          sprite: S_.sprite({
            type:'plankton',
            render: function() {
              return '.';
            }
          })
        };
      case 'rock':
        return {
          name: 'rock',
          sprite: S_.sprite({
            type:'rock',
            render: function() {
              return 'o';
            }
          })
        };
      case 'starfish':
      return {
        name: 'starfish',
        sprite: S_.sprite({
          type:'starfish',
          render: function() {
            return '*';
          }
        })
      };
      case 'octopus':
        return {
          name: 'octopus',
          sprite: S_.sprite({
            type:'octopus',
            render: function() {
              return '#';
            }
          })
        };

      case '':
      default:
        return {
          name: 'empty',
          sprite: S_.sprite({
            type:'empty',
            render: function() {
              return ' ';
            }
          })
        };
    }
  }

  var boundary = function() {
    var that = {};

    return that;
  };

  var display = function(p) {
    var width = p.width || null;
    var height = p.height || null;
    var boundary = p.boundary || null;

    /**
     * @todo
     * functionalize
     * Create a matrix of N-dimension (arity)
     */
      console.log(width);
    var matrix = M.matrix(2, {width:width, height:height});
    matrix.init(S_.actor(buildPlan('')));

    /*
     * Iterate over the contents of the 3d version.
     * For each, if there is nothing at the x & y value, add it & the 3d point.
     */

    var that = {};
    that.render = function(state) {
      /**
       * Iterate through the matrix.
       * If there are no items at that spot, add to loc.
       */
//      var x = state.get('matrix').render();
        matrix.put(M.point({x:0, y:8}), S_.actor(buildPlan('starfish')));
        matrix.put(M.point({x:3, y:2}), S_.actor(buildPlan('plankton')));
        matrix.put(M.point({x:4, y:1}), S_.actor(buildPlan('shark')));
        matrix.put(M.point({x:5, y:9}), S_.actor(buildPlan('rock')));

      console.log(matrix.isEmpty(1, 0));
      console.log(matrix.isEmpty(0, 0));

      var cells = matrix.get('cells');

      var a = [];
      cells.forEach(function(cell, i) {
        var x = cell.get('point').x();
        var nl = x == width - 1 ? '\n' : '';

        var s = '';
        if (!cell.isEmpty()) {
          cell.exec(function(item, pt) {
            if (item !== null) {
              s += this.render({state:state, point:pt});
            }
          });
        }
        else {
          s += ' ';
        }
        a.push(s + nl);
      });

      return a.join('');
    };

    return that;
  };

  var reef = function(p) {
    var state = p.state || M.dictionary();
    var display = p.display || null;

    var that = {};
    that.get = function(k) {
      switch (k) {
        case 'state': return state;
        case 'display': return display;
      }
      return null;
    };
    that.render = function(appstate) {
      return display.render(state);
    };

    return that;
  };

  var pt1 = M.point({x:2, y:3, z:4});
  var pt2 = M.point({x:1, y:1, z:-1});
  var pt3 = pt2.add(pt1);
  console.log(pt3.toString());

  var sayHi = function() {
    console.dir(this);
    console.log("Hi! My name is " + this.get('name') + ".");
  }
  var actr1 = S_.actor({name:'Bruce'}).on('say_hi', sayHi);
  actr1.fire('say_hi');
  var actr2 = S_.actor({name:'Arnold'});

  var directions = M.dictionary({
    'n': M.point({x:0, y:-1, z:0}),
    'ne': M.point({x:1, y:-1, z:0}),
    'e': M.point({x:1, y:0, z:0}),
    'se': M.point({x:1, y:1, z:0}),
    's': M.point({x:0, y:1, z:0}),
    'sw': M.point({x:-1, y:1, z:0}),
    'w': M.point({x:-1, y:0, z:0}),
    'nw': M.point({x:-1, y:-1, z:0}),
    'u' : M.point({x:0, y:0, z:1}),
    'd' : M.point({x:0, y:0, z:-1})
  });

  var sprite1 = S_.sprite({type:'shark'});
  var actor1 = S_.actor({name:'tiger', sprite:sprite1, location: M.point({x:2, y:3, z:1})});

  console.log(directions.getTerms());
  console.log(actor1.get('location').toString());

  var app = function() {
    var state = M.dictionary();
    var elem;
    var X;

    var that = {};
    that.init = function(p) {
      elem = p.elem;

      var width = 20;
      var height = 10;
      var depth = 5;
      var m = M.matrix(3, {width:width, height:height, depth:depth});
      m.init();
      var x = {state: M.dictionary({matrix:m}), display:display({width:width, height:height, boundary:boundary()})};
      X = reef(x);
    };
    that.draw = function() {
      elem.innerHTML = X.render(state);
      console.log('done');
    };
    that.message = function(type) {
      switch (type) {
        case 'unknown property': return 'Unable to set the value of an unknown property';
      }
    };

    return that;
  };

  return app();
}(R, M, E_, S_));

_A_.init({elem:document.getElementById('reef')});
_A_.draw();

/**
 * * = starfish
 Moves 1/2 turns.
 Only octopi eat starfish.
 A new starfish is spawned every 20 turns;
 * ^ = shark
 Moves 2 spaces.  If anything edible is within those spaces, it is eaten.
 A shark moves 1 space, for 3 turns after it has eaten.
 Can eat other sharks.  Randomize result; plus goes to initiator.
 No new sharks are spawned.
 * # = octopus
 * $ = giant squid
 Can eat sharks.  Can be eaten by sharks.  Randomize result, with a plus
 going to the initiator.
 * @ = jelly fish
 3 jelly fish adjacent to anything kills that thing, other than another jelly fish.
 A new jelly fish is spawned for every thing killed.
 Moves 1/3 turns.
 * > = fish
 Moves 2 spaces.  Moves 3 spaces if a shark is within 3 spaces.
 Eats jelly fish.
 A new fish is spawned for every jelly fish eaten.
 */
/**
 * Top down view
 * Break out items properly
 *   - Actor
 *     - on cell.enter  on cell.exit
 *     - link to the previous sprite
 *     - ActorLogic
 *       -
 *   - Sprite
 *
 * Points have x, y, z values
 * As actors descend in depth, they become darker
 *
 * Implement SSEQ?
 */

function forEachIn(o, fn) {
  var p;
  for (p in o) {
    if (Object.prototype.hasOwnProperty.call(o, p)) {
      fn(p, o[p]);
    }
  }
}

function bind(func, obj) {
  return function() {
    return func.apply(obj, arguments);
  };
}

/*
var a = ['alpha', 'beta', 'gamma'];
var b = {};
R.forEach.idx(function(val, ind, lst) {
  b[ind] = val.toUpperCase();
}, a);


function Dictionary(terms) {
  this.values = terms;
}
Dictionary.prototype.get = function(key) {
  return this.values[key];
};
Dictionary.prototype.set = function(key, val) {
  this.values[key] = val;
  return this.values;
};
Dictionary.prototype.contains = function(key) {
  return Object.prototype.propertyIsEnumerable.call(this.values, key);
};
Dictionary.prototype.each = function(action) {
  forEachIn(this.values, action);
}

function Grid(w, h) {
  this.width = w;
  this.height = h;
  this.cells = new Array(w * h);
}
Grid.prototype.val = function(pt) {
  return this.cells[pt.y * this.width + pt.x];
};
Grid.prototype.set = function(pt, val) {
  this.cells[pt.y * this.width + pt.x] = val;
};
Grid.prototype.isInside = function(pt) {
  return pt.x >= 0 && pt.y >= 0 && pt.x < this.width && pt.y < this.height;
};
Grid.prototype.move = function(from, to) {
  this.set(to, this.val(from));
  this.set(from, null);
};
Grid.prototype.each = function(action) {
  var x, y;
  for (y=0; y < this.height; y++) {
    for (x=0; x < this.width; x++) {
      var pt = new Point(x, y);
      action(pt, this.val(pt));
    }
  }
};

function Top() {
  this.glyph = 'V';
}
Top.prototype.render = function() {
  return '<span style="color:lightseagreen">' + this.glyph + '</span>'
};
function Side() {
  this.glyph = '|';
}
Side.prototype.render = function() {
  return '<span style="color:darkseagreen">' + this.glyph + '</span>'
};
function Bottom() {
  this.glyph = '=';
}
Bottom.prototype.render = function() {
  return '<span style="color:darkseagreen">' + this.glyph + '</span>'
};

function Fish() {
  this.glyph = '>';
}
Fish.prototype.act = function() {
  return {type:"move", direction:"s"};
};
Fish.prototype.render = function() {
  return '<span style="color:lightsalmon">' + this.glyph + '</span>'
};

function Shark() {
  this.glyph = '^';
}
Shark.prototype.render = function() {
  return '<span style="color:white">' + this.glyph + '</span>'
};
Shark.prototype.act = function() {
  return {type:"move", direction:"e"};
};

function spriteFromGlyph(glyph) {
  switch (glyph) {
    case '^': return new Shark();
    case '>': return new Fish();
    case '|': return new Side();
    case 'V': return new Top();
    case '=': return new Bottom();
    case ' ':
    default:
      return null;
  }
}
function glyphFromSprite(sprite) {
  if (sprite == null) {
    return ' ';
  }
  else {
    return sprite.render();
  }
}

function Aquarium(plan) {
  var grid = new Grid(plan[0].length, plan.length);
  var line, x, y;

  for (y=0; y < plan.length; y++) {
    line = plan[y];
    for (x=0; x < line.length; x++) {
      grid.set(new Point(x, y), spriteFromGlyph(line.charAt(x)));
    }
  }

  this.grid = grid;
}
Aquarium.prototype.render = function() {
  var output = [];
  var eol = this.grid.width - 1;

  this.grid.each(function(pt, val) {
    output.push(glyphFromSprite(val));

    if (pt.x === eol) {
      output.push('\n')
    }
  });

  return output.join('');
};
Aquarium.prototype.findActors = function() {
  var actors = [];

  this.grid.each(function(pt, val) {
    if (val != null && val.act) {
      actors.push({"object": val, "point": pt});
    }
  });

  return actors;
};
Aquarium.prototype.defineSurroundings = function(center) {
  var result = {};
  var grid = this.grid;

  directions.each(function(name, direction) {
    var loc = center.add(direction);
    if (grid.isInside(loc)) {
      result[name] = glyphFromSprite(grid.val(loc));
    }
    else {
      result[name] = '|';
    }
  });

  return result;
};
Aquarium.prototype.processActor = function(actor) {
  var action = actor.object.act(this.defineSurroundings(actor.point));

  if (action.type == 'move' && directions.contains(action.direction)) {
    var to = actor.point.add(directions.get(action.direction));

    if (this.grid.isInside(to) && this.grid.val(to) == null) {
      this.grid.move(actor.point, to);
    }
  }
  else {
    throw new Error('Unsupported action: ' + action.type);
  }
};
Aquarium.prototype.step = function() {
//  forEachIn(this.findActors(), bind(this.processActor, this));
  var actors = this.findActors();
  var self = this;
  actors.forEach (function(item, i) {
    self.processActor(item);
  });
};


function buildPlan(w, h) {
  var plan = [];
  var a, i, j;

  a = [];
  for (i=0; i < w; i++) {
    a.push('V');
  }
  plan.push(a.join(''));

  for (j=0; j < h; j++) {
    a = [];
    a.push('|');
    for (i=1; i < (w -1); i++) {
      a.push(i%2 ? '+' : 'x');
    }
    a.push('|');
    plan.push(a.join(''));
  }

  a = [];
  for (i=0; i < w; i++) {
    a.push('=');
  }
  plan.push(a.join(''));

  return plan;
}

var directions = new Dictionary({
  'n': new Point(0, -1),
  'ne': new Point(1, -1),
  'e': new Point(1, 0),
  'se': new Point(1, 1),
  's': new Point(0, 1),
  'sw': new Point(-1, 1),
  'w': new Point(-1, 0),
  'nw': new Point(-1, -1)
});

var plan = buildPlan(90, 25);
var c;
c = plan[2].split('');
c[5] = '^';
plan[2] = c.join('');


 c = plan[22].split('');
 c[30] = '>';
 plan[22] = c.join('');

var A = new Aquarium(plan);

var aquarium = document.getElementById('reef');
aquarium.innerHTML = A.render();

function tick() {
  A.step();
  aquarium.innerHTML = A.render();
}
setInterval(tick, 2000);
  */