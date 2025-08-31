// import { View, Text } from 'react-native'
// import React from 'react'
// import { Tabs } from 'expo-router'
// import { MaterialIcons } from '@expo/vector-icons'

// const tabs = [{
//     label: "Home", name: "home", icon: ""},
//     { label: "Tasks", name: "tasks", icon: ""},
//     { label: "Profile", name: "profile", icon: ""}, 
//     { label: "Settings", name: "setting", icon: ""
// }]
// const DashboardLayout = () => {
//   return (
//     <Tabs>
//       screenOptions={{
//         tabBarActiveTintColor: "#007AFF",
//         tabBarInactiveTintColor: "#999",
//         headerShown: false,
//         tabBarStyle: {
//           backgroundColor: "#ccc",
//         }
//       }}
//       {/* <MaterialIcons name="home" size={24} color="black" /> */}
//         {/* <Tabs.Screen name="home" />
//         <Tabs.Screen name="profile" /> */}
//         {tabs.map(({name,icon,label}) => (
//           <Tabs.Screen 
//             key={name} 
//             name={name} 
//             options={{
//               title: label,
//               tabBarIcon: ({ color, size }) => (
//                 <MaterialIcons name={icon as any} color={color} size={size} />
//               ),
//             }} 
//           />
//         ))}
//     </Tabs>
//   )
// }

// export default DashboardLayout

import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import {MaterialIcons} from '@expo/vector-icons'


const tabs = [
    {label:"Home",name:"home",icon:"home-filled"},
    {label:"Tasks",name:"task",icon:"check-circle"},
    {label:"Profile",name:"profile",icon:"person"},
    {label:"Setting",name:"settings",icon:"settings"}
]

const DashboardLayout = () => {
  return (
  <Tabs 
  screenOptions={{
    tabBarActiveTintColor:"#007AFF",
    tabBarInactiveTintColor:"#999",
    headerShown:false,
    tabBarStyle:{
        backgroundColor:"#ccc"
    }
  }}
  >
    {tabs.map(({name,icon,label})=>(
        <Tabs.Screen
        key={name}
        name={name}
        options={{
            title:label,
            tabBarIcon:({color,size})=>(
                <MaterialIcons name={icon as any} color={color} size={size} />
            )
        }}
        />
    ))}
    
  </Tabs>
)
}

export default DashboardLayout