

// import { View, Text } from 'react-native'
// import React from 'react'
// import { Tabs } from 'expo-router'
// import {MaterialIcons} from '@expo/vector-icons'


// const tabs = [
//     {label:"Home",name:"home",icon:"home-filled"},
//     {label:"Books",name:"book",icon:"check-circle"},
//     {label:"Profile",name:"profile",icon:"person"},
//     {label:"Setting",name:"settings",icon:"settings"}
// ]

// const DashboardLayout = () => {
//   return (
//   <Tabs 
//   screenOptions={{
//     tabBarActiveTintColor:"#007AFF",
//     tabBarInactiveTintColor:"#999",
//     headerShown:false,
//     tabBarStyle:{
//         backgroundColor:"#ccc"
//     }
//   }}
//   >
//     {tabs.map(({name,icon,label})=>(
//         <Tabs.Screen
//         key={name}
//         name={name}
//         options={{
//             title:label,
//             tabBarIcon:({color,size})=>(
//                 <MaterialIcons name={icon as any} color={color} size={size} />
//             )
//         }}
//         />
//     ))}
    
//   </Tabs>
// )
// }

// export default DashboardLayout

import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons'

const tabs = [
  { label: "For You", name: "foryou", icon: "home" },
  { label: "Explore", name: "explore", icon: "search" },
  { label: "My Library", name: "library", icon: "library-books" },
  { label: "Profile", name: "profile", icon: "person" }
]

const DashboardLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#7C3AED",
        tabBarInactiveTintColor: "#9CA3AF",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
          paddingBottom: 5,
          paddingTop: 5,
          height: 60
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600"
        }
      }}
    >
      {tabs.map(({ name, icon, label }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title: label,
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name={icon as any} color={color} size={size} />
            )
          }}
        />
      ))}
    </Tabs>
  )
}

export default DashboardLayout