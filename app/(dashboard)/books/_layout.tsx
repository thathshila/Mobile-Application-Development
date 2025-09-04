import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const TaskLayout = () => {
  return <Stack screenOptions={{headerShown: true, animation: "slide_from_right"}}/>
}

export default TaskLayout