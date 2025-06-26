import { NextRequest, NextResponse } from 'next/server';
import { 
  validateEmailData, 
  sendContactNotification, 
  sendAutoReply, 
  type EmailData 
} from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Validate the email data
    if (!validateEmailData(body)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid or missing required fields. Please ensure all fields are filled out correctly.' 
        },
        { status: 400 }
      );
    }

    const emailData: EmailData = body;

    // Send notification email to you
    const notificationResult = await sendContactNotification(emailData);
    
    // Send auto-reply to the user
    const autoReplyResult = await sendAutoReply(emailData);

    console.log('Email sent successfully:', {
      notification: notificationResult.messageId,
      autoReply: autoReplyResult.messageId,
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Your message has been sent successfully! I\'ll get back to you soon.' 
    });

  } catch (error) {
    console.error('Error processing contact form:', error);
    
    // Check if it's a configuration error
    if (error instanceof Error && error.message.includes('Missing email configuration')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Email service is temporarily unavailable. Please try again later.' 
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'An unexpected error occurred. Please try again later.' 
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
