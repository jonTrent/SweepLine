var hitTestCount;
function hitTest(o1, o2) {
  hitTestCount++;
  return (o1.x - o2.x) ** 2 + (o1.y - o2.y) ** 2 <= (o1.radius + o2.radius) ** 2;
}


function bruteForceCollisionCheck() {

  console.log( `\nbruteForceCollisionCheck():\n\n` );
  var performanceCount = 0;
  var consoleResult = [];
  
  for ( i in peopleAndFood ) {
    for ( j in peopleAndFood ) {
      if ( i < j ) {
        let o1 = peopleAndFood[i];
        let o2 = peopleAndFood[j];
        if ( hitTest( o1, o2 ) ) {
          if ( o1.id < o2.id ) {
            consoleResult.push( `Collision:  ${o1.id} with ${o2.id}` );
          } else {
            consoleResult.push( `Collision:  ${o2.id} with ${o1.id}` );
          }
        }
        performanceCount++;
      }
    }
  }
  
  console.log( consoleResult.sort().join( '\n' ) );
  console.log( `\nbruteForceCollisionCheck collision check count: ${performanceCount}\n` );
}

function PeopleAndFood( id, type, x, y, radius ) {
  
  this.id = id;
  this.type = type;
  this.x = x;
  this.y = y;
  this.radius = radius;
 
}

//
// Test algorithm with random data.
//
var peopleAndFood = [];

var sweepLineClosure = SweepLine();

var sweepLineClass = new SweepLineClass();

const width = 10000;
const height = 10000;

const foodCount = 300;

const foodSizeMin = 10;
const foodSizeMax = 20;

const peopleCount = 50; 
const peopleSizeMin = 50;
const peopleSizeMax = 100;

for (i = 0; i < foodCount; i++) {
  peopleAndFood.push( new PeopleAndFood(
    i,
    'food',
    Math.round( width * Math.random() ),
    Math.round( height * Math.random() ),
    foodSizeMin + Math.round(( foodSizeMax - foodSizeMin ) * Math.random())
  ));
  
  let paf = peopleAndFood[ peopleAndFood.length - 1 ];
  sweepLineClosure.add( paf, paf.x - paf.radius, paf.x + paf.radius );
  sweepLineClass.add( paf, paf.x - paf.radius, paf.x + paf.radius );
}

for (i = 0; i < peopleCount; i++) {
  peopleAndFood.push( new PeopleAndFood(
    foodCount + i,
    'people',
    Math.round( width * Math.random() ),
    Math.round( height * Math.random() ),
    peopleSizeMin + Math.round(( peopleSizeMax - peopleSizeMin ) * Math.random())
  ));
  
  let paf = peopleAndFood[ peopleAndFood.length - 1 ];
  sweepLineClosure.add( paf, paf.x - paf.radius, paf.x + paf.radius );
  sweepLineClass.add( paf, paf.x - paf.radius, paf.x + paf.radius );
}

console.log( `Queue\n` );
sweepLineClosure.queuePrint( ( n, loHi, x ) => console.log( `${n.id}: type=${n.type} x=${x} ${loHi ? 'right' : 'left'}\n` ));
console.log( `\n` )

/****************************/

console.log( `\nClosure findCollisions():\n\n` );
hitTestCount = 0;
let collisions = sweepLineClosure.findCollisions( hitTest );
let consoleResult = [];
for ( c in collisions ) {
  consoleResult.push( `Collision:  ${collisions[c][0].id} with ${collisions[c][1].id}` );
}
console.log( consoleResult.sort().join( '\n' ) );
console.log( `\nsweepLineClosure findCollisions collision check count: ${hitTestCount}\n` );

/****************************/

console.log( `\nClass findCollisions():\n\n` );
hitTestCount = 0;
collisions = sweepLineClass.findCollisions( hitTest );
consoleResult = [];
for ( c in collisions ) {
  consoleResult.push( `Collision:  ${collisions[c][0].id} with ${collisions[c][1].id}` );
}
console.log( consoleResult.sort().join( '\n' ) );
console.log( `\nsweepLineClass findCollisions collision check count: ${hitTestCount}\n` );

/****************************/

bruteForceCollisionCheck( peopleAndFood );
