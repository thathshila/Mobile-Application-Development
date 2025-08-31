
import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getTasks } from '@/service/taskService'


const TaskScreen = () => {
    const [tasks,setTasks] = useState([])

    const handleFetchData = async () => {
        await getTasks()
        .then((data)=>{
            console.log(data)
            setTasks(data)

        })
        .catch((err)=>{
            console.log(err)
        })

    }

    useEffect(()=>{
        handleFetchData()
    },[])

  return (
      <View className='flex-1 w-fulL justify-center align-items-center'>
        <Text className='text-4xl'>TaskScreen</Text>
      </View>
  )
}

export default TaskScreen