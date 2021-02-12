// Import built-in Node.js package path.
const path = require('path');

/**
 * Import the ServiceNowConnector class from local Node.js module connector.js
 *   and assign it to constant ServiceNowConnector.
 * When importing local modules, IAP requires an absolute file reference.
 * Built-in module path's join method constructs the absolute filename.
 */
const ServiceNowConnector = require(path.join(__dirname, '/connector.js'));

/**
 * Import built-in Node.js package events' EventEmitter class and
 * assign it to constant EventEmitter. We will create a child class
 * from this class.
 */
const EventEmitter = require('events').EventEmitter;

// We'll use this regular expression to verify REST API's HTTP response status code.
const validResponseRegex = /(2\d\d)/;


/**
 * The ServiceNowAdapter class.
 *
 * @summary ServiceNow Change Request Adapter
 * @description This class contains IAP adapter properties and methods that IAP
 *   brokers and products can execute. This class inherits the EventEmitter
 *   class.
 */
class ServiceNowAdapter extends EventEmitter {

  /**
   * Here we document the ServiceNowAdapter class' callback. It must follow IAP's
   *   data-first convention.
   * @callback ServiceNowAdapter~requestCallback
   * @param {(object|string)} responseData - The entire REST API response.
   * @param {error} [errorMessage] - An error thrown by REST API call.
   */

  /**
   * Here we document the adapter properties.
   * @typedef {object} ServiceNowAdapter~adapterProperties - Adapter
   *   instance's properties object.
   * @property {string} url - ServiceNow instance URL.
   * @property {object} auth - ServiceNow instance credentials.
   * @property {string} auth.username - Login username.
   * @property {string} auth.password - Login password.
   * @property {string} serviceNowTable - The change request table name.
   */

  /**
   * @memberof ServiceNowAdapter
   * @constructs
   *
   * @description Instantiates a new instance of the Itential ServiceNow Adapter.
   * @param {string} id - Adapter instance's ID.
   * @param {ServiceNowAdapter~adapterProperties} adapterProperties - Adapter instance's properties object.
   */
  constructor(id, adapterProperties) {
    // Call super or parent class' constructor.
    super();
    // Copy arguments' values to object properties.
    this.id = id;
    this.props = adapterProperties;
    // Instantiate an object from the connector.js module and assign it to an object property.
    this.connector = new ServiceNowConnector({
     url: this.props.url,
      username: this.props.auth.username,
      password: this.props.auth.password,
      serviceNowTable: this.props.serviceNowTable
    });
  }

  /**
   * @memberof ServiceNowAdapter
   * @method connect
   * @summary Connect to ServiceNow
   * @description Complete a single healthcheck and emit ONLINE or OFFLINE.
   *   IAP calls this method after instantiating an object from the class.
   *   There is no need for parameters because all connection details
   *   were passed to the object's constructor and assigned to object property this.props.
   */
  connect() {
    // As a best practice, Itential recommends isolating the health check action
    // in its own method.
    this.healthcheck();
  }

  /**
 * @memberof ServiceNowAdapter
 * @method healthcheck
 * @summary Check ServiceNow Health
 * @description Verifies external system is available and healthy.
 *   Calls method emitOnline if external system is available.
 *
 * @param {ServiceNowAdapter~requestCallback} [callback] - The optional callback
 *   that handles the response.
 */
healthcheck(callback) {
    let callbackError=null;
       let callbackData=null;
          
 this.getRecord((result, error) => {
  

       //this.connector.get(callback(result,error)); 
       
   /**
    * For this lab, complete the if else conditional
    * statements that check if an error exists
    * or the instance was hibernating. You must write
    * the blocks for each branch.
    */
 
   if (error) {

       if (error=='Service Now instance is hibernating') {
      callbackError = error;
      this.emitOffline();
      log.error(callbackError+" id "+this.id);
       }
       else{
    
      console.log('Error present.'+"error"+error+"id"+this.id);
      callbackError = error;
      this.emitOffline();
      log.error(callbackError+" id "+this.id);
       }
     
   } 
  
    
   else {
     /**
      * Write this block.
      * If no runtime problems were detected, emit ONLINE.
      * Log an appropriate message using IAP's global log object
      * at a debug severity.
      * If an optional IAP callback function was passed to
      * healthcheck(), execute it passing this function's result
      * parameter as an argument for the callback function's
      * responseData parameter.
      */
      //console.log("response from ishibernating() "+this.connector.isHibernating(result));
      this.emitOnline();
      log.debug('no error found' + callbackData);
     
      callbackData = result;
       console.log('no error found' + callbackData);
   }
  
callback(callbackData, callbackError);
    

   

  
 });
 function callback(callbackData, callbackError){
    if(callbackError){
        console.log(callbackError);
        log.debug(callbackError);
        
    }
    else{
      console.log(callbackData); 
      log.debug(callbackData); 
    }
    
}
}

isHibernating(result) {
  return result.body.includes('Instance Hibernating page');
}


  /**
   * @memberof ServiceNowAdapter
   * @method emitOffline
   * @summary Emit OFFLINE
   * @description Emits an OFFLINE event to IAP indicating the external
   *   system is not available.
   */
  emitOffline() {
    this.emitStatus('OFFLINE');
    log.warn('ServiceNow: Instance is unavailable.');
  }

  /**
   * @memberof ServiceNowAdapter
   * @method emitOnline
   * @summary Emit ONLINE
   * @description Emits an ONLINE event to IAP indicating external
   *   system is available.
   */
  emitOnline() {
    this.emitStatus('ONLINE');
    log.info('ServiceNow: Instance is available.');
  }

  /**
   * @memberof ServiceNowAdapter
   * @method emitStatus
   * @summary Emit an Event
   * @description Calls inherited emit method. IAP requires the event
   *   and an object identifying the adapter instance.
   *
   * @param {string} status - The event to emit.
   */
  emitStatus(status) {
    this.emit(status, { id: this.id });
  }


  /**
   * @memberof ServiceNowAdapter
   * @method getRecord
   * @summary Get ServiceNow Record
   * @description Retrieves a record from ServiceNow.
   *
   * @param {ServiceNowAdapter~requestCallback} callback - The callback that
   *   handles the response.
   */
  getRecord(callback) {
    /**
     * Write the body for this function.
     * The function is a wrapper for this.connector's get() method.
     * Note how the object was instantiated in the constructor().
     * get() takes a callback function.
     */

     let callbackData = null;
    let callbackError = null;
    let servicejsonObjResult=null;
 this.connector.get((data, error) => {
    if (error) {
     callbackError=error;
    }
    else{
    var jsonstring = JSON.stringify(data);
    // jsonObject will contain a valid JavaScript object

    let jsonObject =  JSON.parse(jsonstring);//eval('(' + jsonstring + ')');
    let jsonbodystirng = JSON.stringify(jsonObject.body);
   // console.log("jsonbodystirng"+jsonbodystirng.body)
    
    let jsonbodyobj = JSON.parse(jsonObject.body);

     
     for(let i=0;i<jsonbodyobj.result.length; i++){
        let servicejsonobjarray= JSON.stringify(jsonbodyobj.result[i]);
         let jsonresultobjresultarray = JSON.parse(servicejsonobjarray);

         servicejsonObjResult=[{
                               change_ticket_number: jsonresultobjresultarray.number,
                                active: jsonresultobjresultarray.active,
                                priority: jsonresultobjresultarray.priority,
                                description: jsonresultobjresultarray.description,
                                work_start: jsonresultobjresultarray.work_start,
                                work_end: jsonresultobjresultarray.work_end,
                                change_ticket_key: jsonresultobjresultarray.sys_id
                            }
          ]
          console.log("servicejsonObjResultGET ->"+JSON.stringify(servicejsonObjResult));
     }
        
            
    }      

        return callback(servicejsonObjResult, callbackError);
  });

  }
  


  /**
   * @memberof ServiceNowAdapter
   * @method postRecord
   * @summary Create ServiceNow Record
   * @description Creates a record in ServiceNow.
   *
   * @param {ServiceNowAdapter~requestCallback} callback - The callback that
   *   handles the response.
   */
  postRecord(callback) {
    /**
     * Write the body for this function.
     * The function is a wrapper for this.connector's post() method.
     * Note how the object was instantiated in the constructor().
     * post() takes a callback function.
     */
     let callbackData = null;
    let callbackError = null;

    
    this.connector.post(this.connector,(data, error) => {
   if (error) {
      callbackError=error;
    }
    else
    {

    
    
   var jsonstring = JSON.stringify(data);
    let jsonObject =  JSON.parse(jsonstring);//eval('(' + jsonstring + ')');
    let jsonbodystirng = JSON.stringify(jsonObject.body);
    let jsonresultobj = JSON.parse(jsonObject.body);
  

     let servicejsonobj= JSON.stringify(jsonresultobj.result);
   
    let jsonresultobjresult = JSON.parse(servicejsonobj);
    
    let servicejsonObjResult={
                               change_ticket_number: jsonresultobjresult.number,
                                active: jsonresultobjresult.active,
                                priority: jsonresultobjresult.priority,
                                description: jsonresultobjresult.description,
                                work_start: jsonresultobjresult.work_start,
                                work_end: jsonresultobjresult.work_end,
                                change_ticket_key: jsonresultobjresult.sys_id
                            }
console.log("servicejsonObjResultPOST ->"+JSON.stringify(servicejsonObjResult));
                         
     return callback(servicejsonObjResult, callbackError);  
    }
     
  });
  }
}



// Call mainOnObject to run it.


module.exports = ServiceNowAdapter;