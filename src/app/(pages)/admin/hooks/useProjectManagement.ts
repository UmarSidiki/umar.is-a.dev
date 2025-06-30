import { useState, useCallback } from 'react';
import { Project, ProjectFormData } from '../types';

const initialFormData: ProjectFormData = {
  title: '',
  description: '',
  longDescription: '',
  technologies: '',
  category: '',
  status: 'active',
  featured: false,
  githubUrl: '',
  liveUrl: '',
  imageUrl: '',
  images: '',
  startDate: '',
  endDate: '',
  client: '',
  teamSize: '',
  role: '',
};

export const useProjectFormManagement = () => {
  const [formData, setFormData] = useState<ProjectFormData>(initialFormData);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = useCallback((field: keyof ProjectFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingProject ? '/api/projects' : '/api/projects';
      const method = editingProject ? 'PUT' : 'POST';
      const body = editingProject 
        ? { ...formData, id: editingProject._id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (result.success) {
        return { success: true, message: result.message };
      } else {
        return { success: false, message: result.error || 'Operation failed' };
      }
    } catch (error) {
      console.error('Error submitting project:', error);
      return { success: false, message: 'Network error occurred' };
    } finally {
      setLoading(false);
    }
  }, [formData, editingProject]);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setEditingProject(null);
  }, []);

  const loadProjectForEditing = useCallback((project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      longDescription: project.longDescription || '',
      technologies: project.technologies.join(', '),
      category: project.category,
      status: project.status,
      featured: project.featured,
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      imageUrl: project.imageUrl || '',
      images: project.images ? project.images.join(', ') : '',
      startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
      endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
      client: project.client || '',
      teamSize: project.teamSize ? project.teamSize.toString() : '',
      role: project.role || '',
    });
  }, []);

  return {
    formData,
    editingProject,
    loading,
    handleInputChange,
    handleSubmit,
    resetForm,
    loadProjectForEditing,
  };
};

export const useProjectActions = () => {
  const handleEdit = useCallback((project: Project, loadProjectForEditing: (project: Project) => void, setActiveTab: (tab: string) => void) => {
    loadProjectForEditing(project);
    setActiveTab('projects-create');
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/projects?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      const result = await response.json();
      return { success: result.success, message: result.message || result.error };
    } catch (error) {
      console.error('Error deleting project:', error);
      return { success: false, message: 'Network error occurred' };
    }
  }, []);

  return { handleEdit, handleDelete };
};
