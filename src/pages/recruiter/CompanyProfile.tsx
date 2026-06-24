import React, { useState } from 'react';
import { Building2, Calendar, Save } from 'lucide-react';
import { Card, CardContent, Button, Input, Textarea, Select } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';

export const CompanyProfile: React.FC = () => {
  const { recruiterProfile, updateRecruiterProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    company_name: recruiterProfile?.company_name || '',
    company_description: recruiterProfile?.company_description || '',
    company_website: recruiterProfile?.company_website || '',
    industry: recruiterProfile?.industry || '',
    company_size: recruiterProfile?.company_size || '',
    founded_year: recruiterProfile?.founded_year?.toString() || '',
    location: recruiterProfile?.location || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateRecruiterProfile({
        ...formData,
        founded_year: formData.founded_year ? parseInt(formData.founded_year) : undefined,
      });
      alert('Company profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const industryOptions = [
    { value: '', label: 'Select Industry' },
    { value: 'Technology', label: 'Technology' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Healthcare', label: 'Healthcare' },
    { value: 'Education', label: 'Education' },
    { value: 'Manufacturing', label: 'Manufacturing' },
    { value: 'Retail', label: 'Retail' },
    { value: 'Consulting', label: 'Consulting' },
    { value: 'Other', label: 'Other' },
  ];

  const sizeOptions = [
    { value: '', label: 'Select Company Size' },
    { value: '1-10', label: '1-10 employees' },
    { value: '11-50', label: '11-50 employees' },
    { value: '51-200', label: '51-200 employees' },
    { value: '201-500', label: '201-500 employees' },
    { value: '501-1000', label: '501-1000 employees' },
    { value: '1000+', label: '1000+ employees' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Company Profile</h1>
        <p className="text-gray-600 dark:text-gray-400">Update your company information</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Basic Info */}
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
                Basic Information
              </h2>
              <div className="space-y-4">
                <Input
                  label="Company Name"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  required
                />
                <Textarea
                  label="Company Description"
                  value={formData.company_description}
                  onChange={(e) => setFormData({ ...formData, company_description: e.target.value })}
                  placeholder="Describe your company..."
                  rows={4}
                />
                <Input
                  label="Website"
                  type="url"
                  value={formData.company_website}
                  onChange={(e) => setFormData({ ...formData, company_website: e.target.value })}
                  placeholder="https://yourcompany.com"
                />
                <Input
                  label="Location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., San Francisco, CA"
                />
              </div>
            </CardContent>
          </Card>

          {/* Side Info */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Additional Details
                </h3>
                <div className="space-y-4">
                  <Select
                    label="Industry"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    options={industryOptions}
                  />
                  <Select
                    label="Company Size"
                    value={formData.company_size}
                    onChange={(e) => setFormData({ ...formData, company_size: e.target.value })}
                    options={sizeOptions}
                  />
                  <Input
                    label="Founded Year"
                    type="number"
                    value={formData.founded_year}
                    onChange={(e) => setFormData({ ...formData, founded_year: e.target.value })}
                    placeholder="e.g., 2010"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            {recruiterProfile && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Profile Status
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-gray-400" />
                      <span className={`text-sm ${recruiterProfile.verified ? 'text-green-500' : 'text-yellow-500'}`}>
                        {recruiterProfile.verified ? 'Verified' : 'Pending Verification'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Joined {new Date(recruiterProfile.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6">
          <Button type="submit" loading={saving} icon={<Save className="w-4 h-4" />}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};
