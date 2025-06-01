import { View, Text, StyleSheet, ActivityIndicator ,FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../theme/ThemeContext';
// Import Project class, not the variable name
import Project from '../models/projects';

export default function ProjectsScreen() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();

  // Fetch projects when component mounts
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://10.0.2.2:5000/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderProject = ({ item }) => (
    <View style={styles.projectItem}>
      <Text style={styles.projectItemTitle}>{item.name}</Text>
      <View style={styles.projectDates}>
        <Text style={styles.projectDate}>
          Start: {new Date(item.beginDate).toLocaleDateString()}
        </Text>
        <Text style={styles.projectDate}>
          Deadline: {new Date(item.deadline).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme?.background || '#F8F9FA' }]}>
      <Text style={[styles.header, { color: theme?.text || '#212529' }]}>My Projects</Text>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4263EB" />
          <Text style={styles.loadingText}>Loading projects...</Text>
        </View>
      ) : projects.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No projects found</Text>
          <Text style={styles.emptySubtext}>Create a new project to get started</Text>
        </View>
      ) : (
        <FlatList
          data={projects}
          renderItem={renderProject}
          keyExtractor={(item) => item._id || item.id || Math.random().toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={true}
          style={styles.projectList}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8F9FA',
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
    marginTop: 40,
    color: '#212529',
  },
  projectList: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  projectItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  projectItemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 8,
  },
  projectDates: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  projectDate: {
    fontSize: 14,
    color: '#6C757D',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6C757D',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#495057',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#6C757D',
  },
});