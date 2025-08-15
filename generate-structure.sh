#!/bin/bash

# List of all files to create
files=(
  "src/components/auth/LoginForm.tsx"
  "src/components/auth/ProtectedRoute.tsx"
  "src/components/auth/index.ts"
  "src/components/business/forms/BusinessUserRegistrationForm.tsx"
  "src/components/business/forms/index.ts"
  "src/components/business/lists/BusinessUsersList.tsx"
  "src/components/business/lists/index.ts"
  "src/components/business/index.ts"
  "src/components/dashboard/SuperAdminDashboard.tsx"
  "src/components/dashboard/HospitalAdminDashboard.tsx"
  "src/components/dashboard/DoctorDashboard.tsx"
  "src/components/dashboard/index.ts"
  "src/components/common/Layout.tsx"
  "src/components/common/LoadingSpinner.tsx"
  "src/components/common/ErrorBoundary.tsx"
  "src/components/common/index.ts"
  "src/components/ui/Button.tsx"
  "src/components/ui/Input.tsx"
  "src/components/ui/Card.tsx"
  "src/components/ui/index.ts"
  "src/services/api.service.ts"
  "src/services/auth.service.ts"
  "src/services/security.service.ts"
  "src/services/index.ts"
  "src/store/slices/authSlice.ts"
  "src/store/slices/uiSlice.ts"
  "src/store/slices/index.ts"
  "src/store/store.ts"
  "src/store/hooks.ts"
  "src/store/index.ts"
  "src/types/auth.types.ts"
  "src/types/common.types.ts"
  "src/types/api.types.ts"
  "src/types/index.ts"
  "src/hooks/useAuth.ts"
  "src/hooks/usePermissions.ts"
  "src/hooks/useSecureApi.ts"
  "src/hooks/index.ts"
  "src/utils/security.utils.ts"
  "src/utils/validators.ts"
  "src/utils/constants.ts"
  "src/utils/index.ts"
  "src/App.tsx"
)

# Create folders and files
for file in "${files[@]}"; do
  mkdir -p "$(dirname "$file")"  # ensure folder exists
  if [ ! -f "$file" ]; then      # only create if file doesn't exist
    echo "export {};" > "$file"
    echo "Created: $file"
  else
    echo "Exists:  $file"
  fi
done
