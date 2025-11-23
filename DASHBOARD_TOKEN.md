# Kubernetes Dashboard Access Token

**Token (save this for logging into the dashboard):**

```
eyJhbGciOiJSUzI1NiIsImtpZCI6ImV6c1BOajk1RTJBS1hIRktzQktVM0RsSE9BdzdKdUpiTWd4alRkRFB1VVkifQ.eyJhdWQiOlsiaHR0cHM6Ly9rdWJlcm5ldGVzLmRlZmF1bHQuc3ZjLmNsdXN0ZXIubG9jYWwiXSwiZXhwIjoyMDc5MjQwOTI2LCJpYXQiOjE3NjM4ODA5MjYsImlzcyI6Imh0dHBzOi8va3ViZXJuZXRlcy5kZWZhdWx0LnN2Yy5jbHVzdGVyLmxvY2FsIiwianRpIjoiOGI3YzNiMzgtYThhMi00YTM2LWJhOWQtYzcxZWE2NWYxMTI0Iiwia3ViZXJuZXRlcy5pbyI6eyJuYW1lc3BhY2UiOiJrdWJlcm5ldGVzLWRhc2hib2FyZCIsInNlcnZpY2VhY2NvdW50Ijp7Im5hbWUiOiJhZG1pbi11c2VyIiwidWlkIjoiY2U0NzNmMGEtMzgyOS00NDIwLWE4ODUtNWRiNDY3MzU1ZTkzIn19LCJuYmYiOjE3NjM4ODA5MjYsInN1YiI6InN5c3RlbTpzZXJ2aWNlYWNjb3VudDprdWJlcm5ldGVzLWRhc2hib2FyZDphZG1pbi11c2VyIn0.WreEeu9-yjbdrbUa7xQv7OK93ekAGRZIpp9ej5a559tPEybjAYIJXIaLZKUbzq9R7wWH6gbb8BF5iRf4rebdMFILj8kROu06a3uKfOCY0Krq9ROjSZfGoQw3sRuOEXupkUptxwgLp-mZXE8x_44T1TM-RlIgZo5NyAiTxMqxIffElPALP-6DEOBXkGB_AHgqc-KK5YHRexapOcPCPuOSbwXprWyhI9BXjRqJODxiaFx_qI1rbGwV_F3TKmm3AuB2dRwJKP865PdLwxzKwVB5qgNy3iolIMm0ezMPGwZ6GN-1WUaSH6pNAGfxn15AIxft6LNxV5FUPcV0Zmn2CdR7Nw
```

## Access Instructions

1. **Start Port Forward:**
   ```powershell
   kubectl -n kubernetes-dashboard port-forward svc/kubernetes-dashboard 8443:443
   ```

2. **Open Dashboard:**
   Navigate to: https://localhost:8443

3. **Login:**
   - Select "Token" authentication method
   - Paste the token above
   - Click "Sign In"

4. **View Resources:**
   - All your pods, deployments, services, and more will be visible
   - Use the namespace selector to switch between namespaces (default and kubernetes-dashboard)

**Note:** The token is valid for 10 years. Keep this file secure!
