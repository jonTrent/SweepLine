var SweepLine = function() {
  
  const LO = false;
  const HI = true;
  var queueHead = null;
  var objectNodeMap = new Map();
  
  function queueNode( object, loHi, x ) {
    
    this.object = object;
    this.loHi = loHi;
    this.x = x;
    this.prev = null;
    this.next = null;
    
    if ( queueHead ) queueHead.prev = this;
    this.next = queueHead;
    queueHead = this;
    sortNode( this );   
    
  }

  function add( object, loVal, hiVal ) {
  
    let hiNode = new queueNode( object, HI, hiVal );
    let loNode = new queueNode( object, LO, loVal );
    
    objectNodeMap.set( object, {loNode: loNode, hiNode: hiNode} );
  
  }
  
  function update( object, loVal, hiVal ) {

    let n = objectNodeMap.get( object );
    
    if ( n ) {
      n.hiNode.x = hiVal || n.hiNode.x;
      sortNode( n.hiNode );
      
      n.loNode.x = loVal || n.loNode.x;
      sortNode( n.loNode );
    }

  }
  
  function del( object ) {
    
    let n = objectNodeMap.get( object );
    
    if ( n ) {
      deleteNode( n.hiNode );
      deleteNode( n.loNode );
      objectNodeMap.delete( object );
    }
    
  }
  
  function sortNode( node ) {
  
    function moveNode() {
    
      // Remove node from current position in queue.
      deleteNode( node );
      
      // Add node to new position in queue.
      if ( newLocation === null ) {
        node.prev = null;
        node.next = queueHead;
        queueHead = node;
      } else {
        node.prev = newLocation;
        node.next = newLocation.next;
        if ( newLocation.next ) newLocation.next.prev = node;
        newLocation.next = node;
      }
      
    }
    
    // Walk the queue, moving node into the
    // proper spot of the queue based on the x
    // value.  First check against the 'prev' queue
    // node...
    let newLocation = node.prev;
    while (newLocation && node.x < newLocation.x ) {
      newLocation = newLocation.prev;
    }
    
    if (newLocation !== node.prev) moveNode();

    // ...then against the 'next' queue node.
    newLocation = node;
    while (newLocation.next && newLocation.next.x < node.x ) {
      newLocation = newLocation.next;
    }
    
    if (newLocation !== node) moveNode();

  }
  
  function deleteNode( node ) {
  
    if ( node.prev === null ) queueHead = node.next;
    if ( node.prev ) node.prev.next = node.next;
    if ( node.next ) node.next.prev = node.prev;
  
  }
  
  function findCollisions( collisionFunction ) {
   
    let collision = [];
    let activeObjects = new Set();
    
    var node = queueHead;
    while ( node ) {
      
      if ( node.loHi === LO ) {
      
        let object = node.object;
        for ( let ao of activeObjects ) {
          //const ao = activeObjects[ o ];
          if ( collisionFunction( object, ao )) {
            collision.push( [ object, ao ] );
          }
        }
        activeObjects.add( object );
        
      } else {  // node.loHi === HI
        activeObjects.delete( node.object );
      }
      
      node = node.next;
    }

    return collision;
  }
  
  function queuePrint( printFunction ) {
  
    var n = queueHead;
    while (n) {
      printFunction( n.object, n.loHi, n.x )
      n = n.next;
    }
  
  }
  
  return {
    add,
    update,
    del,
    findCollisions,
    queuePrint
  }

}
