class SweepLineClass {

  constructor () {

    this._objectNodeMap = new Map();
    this._queueHead = null;

   }
    
  add( object, loVal, hiVal ) {
  
    let hiNode = new SweepLineClass.NodeClass( this, object, SweepLineClass._HI, hiVal );
    let loNode = new SweepLineClass.NodeClass( this, object, SweepLineClass._LO, loVal );
    
    this._objectNodeMap.set( object, {loNode: loNode, hiNode: hiNode} );
  
  }
  
  update( object, loVal, hiVal ) {

    let n = this._objectNodeMap.get( object );
    
    if ( n ) {
      n.hiNode.x = hiVal || n.hiNode.x;
      this._sortNode( n.hiNode );
      
      n.loNode.x = loVal || n.loNode.x;
      this._sortNode( n.loNode );
    }

  }
  
  del( object ) {
    
    n = this._objectNodeMap.get( object );
    
    if ( n ) {
      this._deleteNode( n.hiNode );
      this._deleteNode( n.loNode );
      this._objectNodeMap.delete( object );
    }
    
  }
  
  _sortNode( node ) {
  
    function moveNode() {
    
      // Remove node from current position in queue.
      this._deleteNode( node );
      
      // Add node to new position in queue.
      if ( newLocation === null ) {
        node._prev = null;
        node._next = this._queueHead;
        this._queueHead = node;
      } else {
        node._prev = newLocation;
        node._next = newLocation._next;
        if ( newLocation._next ) newLocation._next._prev = node;
        newLocation._next = node;
      }
      
    }
    
    // Walk the queue, moving node into the
    // proper spot of the queue based on the x
    // value.  First check against the '_prev' queue
    // node...
    let newLocation = node._prev;
    while (newLocation && node._x < newLocation._x ) {
      newLocation = newLocation._prev;
    }
    
    if (newLocation !== node._prev) moveNode.call( this );

    // ...then against the '_next' queue node.
    newLocation = node;
    while (newLocation._next && newLocation._next._x < node._x ) {
      newLocation = newLocation._next;
    }
    
    if (newLocation !== node) moveNode.call( this );

  }
  
  _deleteNode( node ) {
  
    if ( node._prev === null ) this._queueHead = node._next;
    if ( node._prev ) node._prev._next = node._next;
    if ( node._next ) node._next._prev = node._prev;
  
  }
  
  findCollisions( collisionFunction ) {
   
    let collision = [];
    let activeObjects = new Set();
    
    var node = this._queueHead;
    while ( node ) {
      
      if ( node._loHi === SweepLineClass._LO ) {
      
        let object = node._object;
        for ( let ao of activeObjects ) {
          //const ao = activeObjects[ o ];
          if ( collisionFunction( object, ao )) {
            collision.push( [ object, ao ] );
          }
        }
        activeObjects.add( object );
        
      } else {  // node._loHi === SweepLineClass._HI
        activeObjects.delete( node._object );
      }
      
      node = node._next;
    }

    return collision;
  }
  
  print( printFunction ) {

    var n = this._queueHead;
    while (n) {
      printFunction( n._object, n._loHi, n._x )
      n = n._next;
    }

  }

}

SweepLineClass._LO = false;
SweepLineClass._HI = true;

SweepLineClass.NodeClass = class {
  constructor( sweepLine, object, loHi, x ) {
  
    this._object = object;
    this._parent = sweepLine;
        
    this._loHi = loHi;
    this._x = x;
    this._prev = null;
    this._next = null;

    if ( sweepLine._queueHead ) sweepLine._queueHead.prev = this;
    this._next = sweepLine._queueHead;
    sweepLine._queueHead = this;
    sweepLine._sortNode( this );   
    
  }
}
