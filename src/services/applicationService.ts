export class ApplicationService {
  static async submitApplication(data: any): Promise<{ success: boolean; applicationNumber?: string; error?: string }> {
    try {
      // Get the current domain for the PHP script URL
      const baseUrl = window.location.origin;
      const phpUrl = `${baseUrl}/submit-application.php`;

      // Submit to PHP script
      const response = await fetch(phpUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit application');
      }

      return result;

    } catch (error) {
      console.error('Unexpected error during submission:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again or contact support.' 
      };
    }
  }
}