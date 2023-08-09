import { useEffect, useState } from "react";
import { FlatList, NativeEventEmitter, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { NativeModules } from "react-native";
import BleManager from "react-native-ble-manager"
import { bytesToString } from "convert-string";

export default function BleScreen(){

    const BleManagerModule = NativeModules.BleManager;
    const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
    const [devices , setDevices] = useState([])
    const [connectedUUID , setConnectedUUID] = useState("")
    var scanning = false
    this.state = {
        peripherals: {},
    };

    useEffect(()=>{

        bleManagerEmitter.addListener('BleManagerDiscoverPeripheral',handleDiscoverPeripheral);
        bleManagerEmitter.addListener('BleManagerStopScan',handleStopScan);
        bleManagerEmitter.addListener("BleManagerDidUpdateState", (args) => {handleState(args)});
        bleManagerEmitter.addListener("BleManagerDidUpdateValueForCharacteristic",
            ({ value, peripheral, characteristic, service }) => {
              
              console.log(peripheral,value)
            //   const data = bytesToString(value);
            //   console.log(`Received ${data} for characteristic ${characteristic}`);
            }
          );
    },[])

    const handleDiscoverPeripheral = (peripheral) => {
        const { peripherals } = this.state;

        if (peripheral.name != undefined) {

            // if (peripheral.name.includes("iTAG") || peripheral.name.includes("iTrack")){
                peripherals[peripheral.name] = String(peripheral.id)
            // }
            // peripherals[peripheral.name] = String(peripheral.id)
        }
        
        
        
    };
      
    const handleStopScan = () => {
        if (scanning){
            console.log('Scan is stopped. Devices: ');
            const copy_a = []
            Object.entries(this.state.peripherals)
            .map( ([key, value]) => copy_a.push({"name":key,"id":value}))
            setDevices(copy_a)
            scanning = false
        }        
    }
    const handleState = (data) =>{
        console.log(data)
    }



    const scan = () =>{
        if (!scanning){
            BleManager.scan([], 3, true).then(() => {
                scanning = true
                console.log("Scan started");
              }).catch(error => {console.log(error)});
        }
    }

    const stop = () =>{
        BleManager.stopScan().then(() => {
            console.log("Scan stopped");
          });
    }

    const connect = (id) =>{
        BleManager.connect(id).then(() => {
            console.log('Connected to ' + id);
            BleManager.retrieveServices(id).then((peripheralInfo) => {
                const data = peripheralInfo.characteristics
                data.forEach((element) =>{
                    console.log(element)
                })

                var notifyService = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
                var notifyCharacteristic = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';
                BleManager.startNotification(id, notifyService, notifyCharacteristic).then(()=>{
                    console.log("start Notify")
                }).catch((error) => {console.log("ERROR",error)})
                 
                setConnectedUUID(id)

            }).catch(error =>{console.log(error,"retrieve fail")})
        }).catch(error =>{console.log("failed" ,error)})
    }

    const write = ()=>{
        var service = '180F';
        var bakeCharacteristic = '2A19';

        BleManager.read(connectedUUID,service,bakeCharacteristic).then((readData)=>{
            console.log(readData)
        })

        
        // BleManager.write(connectedUUID, service, bakeCharacteristic, [parseInt("0x03")]).then(()=>{
            // console.log('Write: success' );
        // }).catch(error => {console.log(error)})

    }
    


    return (
        <SafeAreaView style={{backgroundColor:'white' , height:'100%',alignItems:'center',justifyContent:'center' , flexDirection:'row'}}>


            <View style={{backgroundColor:'white' , height:'100%', flex:1,alignItems:'center',justifyContent:'center'}}>
                <TouchableOpacity style={{backgroundColor:'gray',padding:20, marginBottom:20}} onPress={()=>scan()}>
                    <Text style={{color:'white'}}>scan</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{backgroundColor:'gray',padding:20, marginBottom:20}} onPress={()=>write()}>
                    <Text style={{color:'white'}}>write</Text>
                </TouchableOpacity>
            </View>
            <View style={{backgroundColor:'white' , height:'100%',flex:1,alignItems:'center',justifyContent:'center'}}>
                <FlatList style={{backgroundColor:'white', width:"100%" , height:"100%",marginTop:20}}
                data={devices}
                renderItem={({item}) => {
                    return (
                        <TouchableOpacity onPress={() => connect(item.id)}>
                            <View style={{backgroundColor: 'white'}}>
                                <Text style={{fontSize: 12, textAlign: 'center', color: '#000000', padding: 10}}>{item.name}</Text>
                                <Text style={{fontSize: 8, textAlign: 'center', color: '#000000', padding: 10}}>{item.id}</Text>
                            </View>
                        </TouchableOpacity>
                    );
                }}
                keyExtractor={item => item.id}/>
            </View>
            
        </SafeAreaView>
    )
}