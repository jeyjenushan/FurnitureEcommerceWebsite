import { useQuery } from "react-query";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../services/authService";
import { User, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { toast } from "react-toastify";

const Profile = () => {
  const { user } = useAuth();

  const { data: profile, isLoading } = useQuery(
    "user-profile",
    async () => {
      const response = await authService.getApiClient().get("/user/profile");
      return response.data.data;
    },
    {
      initialData: user,
      onError: () => toast.error("Failed to fetch profile data"),
    }
  );

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-amber-200 rounded w-1/3 mb-6"></div>
          <div className="bg-amber-50 rounded-lg shadow-sm p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-amber-100 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const profileFields = [
    {
      label: "Username",
      value: profile?.username,
      icon: User,
      description: "Your unique identifier",
    },
    {
      label: "Full Name",
      value: profile?.name,
      icon: User,
      description: "Your display name",
    },
    {
      label: "Email Address",
      value: profile?.email,
      icon: Mail,
      description: "Your registered email",
    },
    {
      label: "Contact Number",
      value: profile?.contactNumber || "Not provided",
      icon: Phone,
      description: "Your phone number for delivery updates",
    },
    {
      label: "Country",
      value: profile?.country,
      icon: MapPin,
      description: "Your country of residence",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-amber-900 mb-2">My Profile</h1>
        <p className="text-amber-700">Your account information and settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-amber-50 rounded-lg shadow-sm border border-amber-200">
            <div className="px-6 py-4 border-b border-amber-200">
              <h2 className="text-lg font-semibold text-amber-900">
                Account Information
              </h2>
              <p className="text-sm text-amber-700">
                Your personal details from Asgardeo identity provider
              </p>
            </div>

            <div className="p-6 space-y-6">
              {profileFields.map((field, index) => {
                const Icon = field.icon;
                return (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="bg-amber-200 p-2 rounded-md">
                        <Icon className="h-4 w-4 text-orange-600" />
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <dt className="text-sm font-medium text-amber-700">
                          {field.label}
                        </dt>
                      </div>
                      <dd className="mt-1 text-sm text-amber-900 font-medium">
                        {field.value || "Not available"}
                      </dd>
                      <dd className="mt-1 text-xs text-amber-600">
                        {field.description}
                      </dd>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-amber-50 rounded-lg shadow-sm border border-amber-200 p-6">
            <h3 className="text-lg font-semibold text-amber-900 mb-4">
              <Calendar className="h-5 w-5 inline mr-2 text-orange-600" />
              Account Activity
            </h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-amber-700">Member Since</div>
                <div className="text-lg font-semibold text-amber-900">2025</div>
              </div>
              <div>
                <div className="text-sm text-amber-700">Last Login</div>
                <div className="text-sm font-medium text-amber-900">
                  {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
