import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Trash2, Download } from 'lucide-react';
import { Card, CardContent, Button, Input, Textarea, Badge } from '../../components/ui';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import type { Resume } from '../../types';

export const JobSeekerProfile: React.FC = () => {
  const { user, jobSeekerProfile, updateJobSeekerProfile, createJobSeekerProfile } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    headline: '',
    summary: '',
    skills: '',
    location: '',
    linkedin_url: '',
    portfolio_url: '',
    github_url: '',
  });

  useEffect(() => {
    if (user) {
      fetchResumes();
      if (jobSeekerProfile) {
        setFormData({
          headline: jobSeekerProfile.headline || '',
          summary: jobSeekerProfile.summary || '',
          skills: jobSeekerProfile.skills?.join(', ') || '',
          location: jobSeekerProfile.location || '',
          linkedin_url: jobSeekerProfile.linkedin_url || '',
          portfolio_url: jobSeekerProfile.portfolio_url || '',
          github_url: jobSeekerProfile.github_url || '',
        });
      }
    }
  }, [user, jobSeekerProfile]);

  const fetchResumes = async () => {
    try {
      const { data } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user?.id)
        .order('uploaded_at', { ascending: false });

      setResumes(data || []);
    } catch (error) {
      console.error('Error fetching resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadResume = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(fileName);

      const { error: insertError } = await supabase
        .from('resumes')
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_url: publicUrl,
          file_size: file.size,
          is_primary: resumes.length === 0,
        });

      if (insertError) throw insertError;

      fetchResumes();
    } catch (error) {
      console.error('Error uploading resume:', error);
      alert('Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteResume = async (resume: Resume) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;

    try {
      // Delete from storage
      const path = resume.file_url.split('/').pop();
      await supabase.storage.from('resumes').remove([`${user?.id}/${path}`]);

      // Delete from database
      await supabase.from('resumes').delete().eq('id', resume.id);

      fetchResumes();
    } catch (error) {
      console.error('Error deleting resume:', error);
    }
  };

  const handleSetPrimary = async (resumeId: string) => {
    try {
      // Remove primary from others
      await supabase
        .from('resumes')
        .update({ is_primary: false })
        .eq('user_id', user?.id);

      // Set this as primary
      await supabase
        .from('resumes')
        .update({ is_primary: true })
        .eq('id', resumeId);

      fetchResumes();
    } catch (error) {
      console.error('Error setting primary resume:', error);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const profileData = {
        headline: formData.headline,
        summary: formData.summary,
        skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
        location: formData.location,
        linkedin_url: formData.linkedin_url,
        portfolio_url: formData.portfolio_url,
        github_url: formData.github_url,
      };

      if (jobSeekerProfile) {
        await updateJobSeekerProfile(profileData);
      } else {
        await createJobSeekerProfile(profileData);
      }

      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Profile</h1>
        <p className="text-gray-600 dark:text-gray-400">Update your profile and manage your resumes</p>
      </div>

      {/* Profile Form */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Profile Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Headline"
              value={formData.headline}
              onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
              placeholder="e.g., Software Engineer at Tech Company"
            />
            <Input
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., San Francisco, CA"
            />
            <Textarea
              label="Summary"
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="Write a brief professional summary..."
              className="md:col-span-2"
            />
            <Input
              label="Skills (comma-separated)"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              placeholder="e.g., JavaScript, React, Node.js, Python"
              className="md:col-span-2"
            />
            <Input
              label="LinkedIn URL"
              value={formData.linkedin_url}
              onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
              placeholder="https://linkedin.com/in/yourprofile"
            />
            <Input
              label="Portfolio URL"
              value={formData.portfolio_url}
              onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
              placeholder="https://yourportfolio.com"
            />
            <Input
              label="GitHub URL"
              value={formData.github_url}
              onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
              placeholder="https://github.com/yourusername"
            />
          </div>

          <div className="mt-6">
            <Button onClick={handleSaveProfile} loading={saving}>
              Save Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resumes */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              My Resumes
            </h2>
            <label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleUploadResume}
                className="hidden"
                disabled={uploading}
              />
              <Button variant="primary" icon={<Upload className="w-4 h-4" />} loading={uploading}>
                Upload Resume
              </Button>
            </label>
          </div>

          {resumes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No resumes uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {resumes.map((resume, index) => (
                <motion.div
                  key={resume.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="w-12 h-12 rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {resume.file_name}
                      </p>
                      {resume.is_primary && (
                        <Badge variant="success" size="sm">
                          Primary
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      Uploaded {new Date(resume.uploaded_at).toLocaleDateString()}
                      {resume.file_size && ` • ${(resume.file_size / 1024).toFixed(1)} KB`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!resume.is_primary && (
                      <Button variant="outline" size="sm" onClick={() => handleSetPrimary(resume.id)}>
                        Set Primary
                      </Button>
                    )}
                    <a href={resume.file_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" icon={<Download className="w-4 h-4" />}>
                        Download
                      </Button>
                    </a>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteResume(resume)}
                      icon={<Trash2 className="w-4 h-4" />}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
