import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native'
import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'

export default function historyScreens() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchSessions = async () => {
    try {
      const response = await axios.get('http://10.0.2.2:5000/sessions')
      setSessions(response.data)
      return response.data
    } catch (err) {
      console.error('Error fetching sessions:', err)
      setError('Failed to load sessions')
      return []
    }
  }

  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await fetchSessions()
      setLoading(false)
    }
    loadData()
  }, [])

  // Pull to refresh handler
  const onRefresh = async () => {
    setRefreshing(true)
    await fetchSessions()
    setRefreshing(false)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }
  
  const renderItem = ({ item }) => (
    <View style={styles.sessionCard}>
      <View style={styles.sessionHeader}>
        <View 
          style={[styles.typeIndicator, { 
            backgroundColor: item.type === 'work' ? '#4263EB' : '#38D9A9' 
          }]} 
        />
        <Text style={styles.sessionType}>
          {item.type === 'work' ? 'Work Session' : 'Break Session'}
        </Text>
      </View>
      <View style={styles.sessionDetails}>
        <Text style={styles.sessionDate}>{formatDate(item.date)}</Text>
        <Text style={styles.sessionDuration}>{Math.floor(item.duration / 60)} minutes</Text>
      </View>
      {item.notes && <Text style={styles.notes}>{item.notes}</Text>}
    </View>
  )

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4263EB" />
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Session History</Text>
      
      {sessions.length > 0 ? (
        <FlatList 
          data={sessions}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={["#4263EB"]} 
              tintColor={"#4263EB"}
            />
          }
        />
      ) : (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No sessions recorded yet</Text>
        </View>
      )}
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#212529',
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 20,
  },
  sessionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  sessionType: {
    fontSize: 18,
    fontWeight: '600',
    color: '#343A40',
  },
  sessionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sessionDate: {
    fontSize: 14,
    color: '#6C757D',
  },
  sessionDuration: {
    fontSize: 14,
    fontWeight: '500',
    color: '#495057',
  },
  notes: {
    fontSize: 14,
    color: '#6C757D',
    fontStyle: 'italic',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6C757D',
  },
  errorText: {
    fontSize: 16,
    color: '#FA5252',
  },
});