import React from "react";
import { Project } from "../types";

interface ManageProjectsProps {
  projects: Project[];
  loading: boolean;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

export const ManageProjects: React.FC<ManageProjectsProps> = ({
  projects,
  loading,
  onEdit,
  onDelete,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50 shadow-xl">
        <div className="p-6 border-b border-neutral-200/50 dark:border-neutral-700/50">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Manage Projects
          </h2>
        </div>
        <div className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
            <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
          <p className="text-neutral-600 dark:text-neutral-400">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50 shadow-xl">
      <div className="p-6 border-b border-neutral-200/50 dark:border-neutral-700/50">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          Manage Projects
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 mt-1">
          Edit or delete your projects
        </p>
      </div>

      <div className="p-6">
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full mb-4">
              <span className="text-2xl">📁</span>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              No projects found
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Start by creating your first project!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-white/50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200/50 dark:border-neutral-700/50 p-6 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                          {project.title}
                        </h3>
                        <p className="text-neutral-600 dark:text-neutral-400 text-sm line-clamp-2">
                          {project.description}
                        </p>
                      </div>
                      {project.featured && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                          ⭐ Featured
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
                        {project.category}
                      </span>
                      {project.technologies && project.technologies.length > 0 && (
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                          {project.technologies.slice(0, 3).join(', ')}
                          {project.technologies.length > 3 && ` +${project.technologies.length - 3} more`}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
                      <span>Created: {formatDate(project.createdAt)}</span>
                      {project.updatedAt !== project.createdAt && (
                        <span>Updated: {formatDate(project.updatedAt)}</span>
                      )}
                    </div>

                    {(project.githubUrl || project.liveUrl) && (
                      <div className="flex items-center gap-3 mt-3">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-xs text-neutral-600 dark:text-neutral-400 hover:text-primary transition-colors"
                          >
                            <span className="mr-1">🔗</span>
                            GitHub
                          </a>
                        )}
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-xs text-neutral-600 dark:text-neutral-400 hover:text-primary transition-colors"
                          >
                            <span className="mr-1">🌐</span>
                            Live Demo
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(project)}
                      className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
                          onDelete(project._id);
                        }
                      }}
                      className="px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg transition-colors text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
