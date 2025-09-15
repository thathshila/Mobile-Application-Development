// import { View, Text } from 'react-native'
// import React from 'react'
// import { Tabs } from 'expo-router'
// import { MaterialIcons } from '@expo/vector-icons'
// const tabs = [
//   { label: "For You", name: "foryou", icon: "home" },
//   { label: "Explore", name: "explore", icon: "search" },
//   { label: "Library", name: "library", icon: "library-books" },
//   { label: "Profile", name: "profile", icon: "person" }
// ]

// const DashboardLayout = () => {
//   return (
//     <Tabs
//       screenOptions={{
//         tabBarActiveTintColor: "#7C3AED",
//         tabBarInactiveTintColor: "#9CA3AF",
//         headerShown: false,
//         tabBarStyle: {
//           backgroundColor: "#FFFFFF",
//           borderTopWidth: 1,
//           borderTopColor: "#E5E7EB",
//           paddingBottom: 5,
//           paddingTop: 5,
//           height: 60
//         },
//         tabBarLabelStyle: {
//           fontSize: 12,
//           fontWeight: "600"
//         }
//       }}
//     >
//       {tabs.map(({ name, icon, label }) => (
//         <Tabs.Screen
//           key={name}
//           name={name}
//           options={{
//             title: label,
//             tabBarIcon: ({ color, size }) => (
//               <MaterialIcons name={icon as any} color={color} size={size} />
//             )
//           }}
//         />
//       ))}
//     </Tabs>
//   )
// }

// export default DashboardLayout

import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons'

// Define proper type for icon names
type MaterialIconName = React.ComponentProps<typeof MaterialIcons>['name'];

const tabs = [
  { label: "For You", name: "foryou", icon: "home" as MaterialIconName },
  { label: "Explore", name: "explore", icon: "search" as MaterialIconName },
  { label: "Library", name: "library", icon: "library-books" as MaterialIconName },
  { label: "Profile", name: "profile", icon: "person" as MaterialIconName }
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
          paddingBottom: 35,
          paddingTop: 0,
          height: 90
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
              <MaterialIcons name={icon} color={color} size={size} />
            )
          }}
        />
      ))}
    </Tabs>
  )
}

export default DashboardLayout