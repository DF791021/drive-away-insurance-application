<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit();
}

// Configuration - UPDATE THESE WITH YOUR DETAILS
$to_email = 'your-email@gmail.com'; // Your email address where applications should be sent
$from_email = 'noreply@yourdomain.com'; // Must be an email from your domain (e.g., noreply@yoursite.com)
$subject_prefix = 'New Drive-Away Insurance Application';

// Optional: SMTP Configuration for Namecheap (more reliable than mail())
// Uncomment and configure if basic mail() doesn't work
/*
$smtp_host = 'mail.yourdomain.com';
$smtp_port = 587; // or 465 for SSL
$smtp_username = 'noreply@yourdomain.com'; // Your domain email
$smtp_password = 'your-email-password';
$use_smtp = true;
*/
$use_smtp = false;

// Get JSON input
$json_input = file_get_contents('php://input');
$data = json_decode($json_input, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid JSON data']);
    exit();
}

// Generate application number
$application_number = 'DA-' . substr(time(), -8);

// Format the email content
$email_content = formatApplicationEmail($data, $application_number);

// Send email
$mail_sent = false;

if ($use_smtp) {
    // Use SMTP (more reliable for Namecheap)
    $mail_sent = sendSMTPEmail($to_email, $subject_prefix . ' - ' . $application_number, $email_content, $from_email);
} else {
    // Use basic PHP mail() function
    $headers = array(
        'From' => $from_email,
        'Reply-To' => $from_email,
        'Content-Type' => 'text/plain; charset=UTF-8',
        'X-Mailer' => 'PHP/' . phpversion(),
        'X-Priority' => '1', // High priority
        'Importance' => 'high'
    );
    
    $mail_sent = mail(
        $to_email,
        $subject_prefix . ' - ' . $application_number,
        $email_content,
        implode("\r\n", array_map(function($k, $v) { return "$k: $v"; }, array_keys($headers), $headers))
    );
}

if ($mail_sent) {
    // Log successful submission (optional)
    $log_entry = date('Y-m-d H:i:s') . " - Application $application_number submitted successfully\n";
    @file_put_contents('application_log.txt', $log_entry, FILE_APPEND | LOCK_EX);
    
    echo json_encode([
        'success' => true,
        'applicationNumber' => $application_number,
        'message' => 'Application submitted successfully'
    ]);
} else {
    // Log failed submission
    $log_entry = date('Y-m-d H:i:s') . " - Application submission FAILED - Email not sent\n";
    @file_put_contents('application_log.txt', $log_entry, FILE_APPEND | LOCK_EX);
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Failed to send email. Please contact support.'
    ]);
}

// SMTP Email Function (for Namecheap)
function sendSMTPEmail($to, $subject, $message, $from) {
    global $smtp_host, $smtp_port, $smtp_username, $smtp_password;
    
    // This is a basic SMTP implementation
    // For production, consider using PHPMailer library
    $socket = fsockopen($smtp_host, $smtp_port, $errno, $errstr, 30);
    
    if (!$socket) {
        return false;
    }
    
    // Basic SMTP conversation
    fgets($socket, 512);
    fputs($socket, "HELO " . $_SERVER['SERVER_NAME'] . "\r\n");
    fgets($socket, 512);
    
    if ($smtp_port == 587 || $smtp_port == 465) {
        fputs($socket, "STARTTLS\r\n");
        fgets($socket, 512);
    }
    
    fputs($socket, "AUTH LOGIN\r\n");
    fgets($socket, 512);
    fputs($socket, base64_encode($smtp_username) . "\r\n");
    fgets($socket, 512);
    fputs($socket, base64_encode($smtp_password) . "\r\n");
    fgets($socket, 512);
    
    fputs($socket, "MAIL FROM: <$from>\r\n");
    fgets($socket, 512);
    fputs($socket, "RCPT TO: <$to>\r\n");
    fgets($socket, 512);
    fputs($socket, "DATA\r\n");
    fgets($socket, 512);
    
    $email_data = "Subject: $subject\r\n";
    $email_data .= "From: $from\r\n";
    $email_data .= "To: $to\r\n";
    $email_data .= "Content-Type: text/plain; charset=UTF-8\r\n\r\n";
    $email_data .= $message . "\r\n.\r\n";
    
    fputs($socket, $email_data);
    fgets($socket, 512);
    fputs($socket, "QUIT\r\n");
    fclose($socket);
    
    return true;
}

function formatApplicationEmail($data, $application_number) {
    $drivers = $data['drivers'] ?? [];
    $driversText = '';
    foreach ($drivers as $index => $driver) {
        $driverNum = $index + 1;
        $driversText .= "\nDriver $driverNum:\n";
        $driversText .= "  Name: " . ($driver['name'] ?? 'Not provided') . "\n";
        $driversText .= "  DOB: " . ($driver['dateOfBirth'] ?? 'Not provided') . "\n";
        $driversText .= "  License: " . ($driver['licenseState'] ?? '') . " " . ($driver['licenseNumber'] ?? '') . "\n";
        $driversText .= "  Years Licensed: " . ($driver['yearsLicensed'] ?? 'Not provided') . "\n";
        $driversText .= "  Experience: " . ($driver['experienceYears'] ?? 'Not provided') . " years\n";
        $driversText .= "  Type: " . ($driver['employeeType'] ?? 'Not provided') . "\n";
        if (!empty($driver['accidents'])) {
            $driversText .= "  Accidents: " . $driver['accidents'] . "\n";
        }
        if (!empty($driver['violations'])) {
            $driversText .= "  Violations: " . $driver['violations'] . "\n";
        }
        if (!empty($driver['convictions'])) {
            $driversText .= "  Convictions: " . $driver['convictions'] . "\n";
        }
        $driversText .= "\n";
    }

    $priorInsurance = $data['priorInsurance'] ?? [];
    $priorInsuranceText = '';
    foreach ($priorInsurance as $index => $record) {
        $recordNum = $index + 1;
        $priorInsuranceText .= "\nPrior Insurance $recordNum:\n";
        $priorInsuranceText .= "  Carrier: " . ($record['carrierName'] ?? 'Not provided') . "\n";
        $priorInsuranceText .= "  Policy Term: " . ($record['policyTerm'] ?? 'Not provided') . "\n";
        $priorInsuranceText .= "  Vehicles: " . ($record['vehicles'] ?? 'Not provided') . "\n";
        $priorInsuranceText .= "  Accidents: " . ($record['accidents'] ?? '0') . "\n";
        $priorInsuranceText .= "  Premium: " . ($record['premium'] ?? 'Not provided') . "\n";
        $priorInsuranceText .= "  Claims Paid: " . ($record['claimsPaid'] ?? 'Not provided') . "\n\n";
    }

    // Format coverage details
    $liabilityCoverage = '';
    if (($data['liabilityCoverageType'] ?? '') === 'combined') {
        $limit = number_format(intval($data['combinedLimit'] ?? 0));
        $liabilityCoverage = "Combined Single Limit: $$limit";
    } elseif (($data['liabilityCoverageType'] ?? '') === 'split') {
        $bi_person = number_format(intval($data['bodilyInjuryPerPerson'] ?? 0));
        $bi_accident = number_format(intval($data['bodilyInjuryPerAccident'] ?? 0));
        $pd = number_format(intval($data['propertyDamage'] ?? 0));
        $liabilityCoverage = "Split Limits: $$bi_person/$$bi_accident/$$pd";
    } else {
        $liabilityCoverage = 'Not selected';
    }

    // Build email content
    $content = "==========================================\n";
    $content .= "DRIVE-AWAY INSURANCE APPLICATION\n";
    $content .= "==========================================\n";
    $content .= "APPLICATION NUMBER: $application_number\n";
    $content .= "SUBMISSION DATE: " . date('Y-m-d H:i:s T') . "\n";
    $content .= "SERVER: " . ($_SERVER['SERVER_NAME'] ?? 'Unknown') . "\n\n";
    
    $content .= "================================\n";
    $content .= "COMPANY INFORMATION\n";
    $content .= "================================\n";
    $content .= "Company Name: " . ($data['companyName'] ?? '') . "\n";
    $content .= "DBA: " . ($data['dba'] ?? 'N/A') . "\n";
    $content .= "Business Type: " . ($data['businessType'] ?? '') . "\n";
    $content .= "Phone: " . ($data['businessPhone'] ?? '') . "\n";
    $content .= "Mailing Address: " . ($data['mailingStreet'] ?? '') . ", " . ($data['mailingCity'] ?? '') . ", " . ($data['mailingState'] ?? '') . " " . ($data['mailingZip'] ?? '') . "\n";
    $content .= "Premises Address: " . (($data['sameAddress'] ?? false) ? 'Same as mailing address' : (($data['premisesStreet'] ?? '') . ", " . ($data['premisesCity'] ?? '') . ", " . ($data['premisesState'] ?? '') . " " . ($data['premisesZip'] ?? ''))) . "\n";
    $content .= "Contact Person: " . ($data['contactPerson'] ?? '') . "\n\n";
    
    $content .= "================================\n";
    $content .= "BUSINESS OPERATIONS\n";
    $content .= "================================\n";
    $content .= "Description: " . ($data['businessDescription'] ?? '') . "\n";
    $content .= "Years Experience: " . ($data['yearsExperience'] ?? '') . "\n";
    $content .= "New Venture: " . (($data['newVenture'] ?? false) ? 'Yes' : 'No') . "\n";
    $content .= "Primary Business: " . (($data['primaryBusiness'] ?? false) ? 'Yes' : 'No') . "\n";
    $content .= "Other Business: " . ($data['otherBusiness'] ?? 'N/A') . "\n";
    $content .= "Gross Receipts Last Year: " . ($data['grossReceiptsLastYear'] ?? 'Not provided') . "\n";
    $content .= "Estimated Receipts: " . ($data['estimatedReceipts'] ?? 'Not provided') . "\n";
    $content .= "Business For Sale: " . (($data['businessForSale'] ?? false) ? 'Yes' : 'No') . "\n";
    $content .= "Bankruptcy History: " . (($data['bankruptcyHistory'] ?? false) ? 'Yes' : 'No') . "\n";
    if ($data['bankruptcyHistory'] ?? false) {
        $content .= "Bankruptcy Details: Date: " . ($data['bankruptcyDate'] ?? '') . ", Details: " . ($data['bankruptcyExplanation'] ?? '') . "\n";
    }
    $content .= "\n";
    
    $content .= "================================\n";
    $content .= "COVERAGE SELECTION\n";
    $content .= "================================\n";
    $content .= "Liability Coverage: $liabilityCoverage\n";
    $content .= "Medical Payments: " . (($data['medicalPayments'] ?? '') ? '$' . number_format(intval($data['medicalPayments'])) : 'No coverage') . "\n";
    $content .= "Personal Injury Protection: " . (($data['personalInjuryProtection'] ?? '') ? '$' . number_format(intval($data['personalInjuryProtection'])) : 'No coverage') . "\n";
    $content .= "Uninsured Motorist: " . (($data['uninsuredMotorist'] ?? false) ? 'Yes' : 'No') . "\n";
    $content .= "Underinsured Motorist: " . (($data['underinsuredMotorist'] ?? false) ? 'Yes' : 'No') . "\n";
    $content .= "Physical Damage: " . (($data['physicalDamageDesired'] ?? false) ? 'Yes' : 'No') . "\n";
    if ($data['physicalDamageDesired'] ?? false) {
        $content .= "Physical Damage Details: Average Value: $" . ($data['averageVehicleValue'] ?? 'Not provided') . ", Max Value: $" . ($data['maximumVehicleValue'] ?? 'Not provided') . ", Comp Deductible: $" . ($data['comprehensiveDeductible'] ?? 'Not provided') . ", Collision Deductible: $" . ($data['collisionDeductible'] ?? 'Not provided') . "\n";
    }
    $content .= "\n";
    
    $content .= "================================\n";
    $content .= "DRIVERS (" . count($drivers) . ")\n";
    $content .= "================================\n";
    $content .= $driversText ?: "No drivers added\n";
    
    $content .= "================================\n";
    $content .= "DRIVER REQUIREMENTS\n";
    $content .= "================================\n";
    $content .= "Minimum Experience Required: " . ($data['minExperienceRequired'] ?? 'Not specified') . "\n";
    $content .= "Driver Pay Basis: " . ($data['driverPayBasis'] ?? 'Not specified') . "\n";
    $content .= "Max Daily Hours: " . ($data['maxDailyHours'] ?? 'Not specified') . "\n";
    $content .= "Max Weekly Hours: " . ($data['maxWeeklyHours'] ?? 'Not specified') . "\n";
    $content .= "Workers' Compensation: " . (($data['workersCompensation'] ?? false) ? 'Yes' : 'No') . "\n";
    $content .= "Workers' Comp Carrier: " . ($data['workersCompCarrier'] ?? 'N/A') . "\n";
    $content .= "Take Vehicles Home: " . (($data['takeVehiclesHome'] ?? false) ? 'Yes' : 'No') . "\n";
    $content .= "Order MVRs: " . (($data['orderMVRs'] ?? false) ? 'Yes' : 'No') . "\n";
    $content .= "Report New Hires: " . (($data['reportNewHires'] ?? false) ? 'Yes' : 'No') . "\n\n";
    
    $content .= "================================\n";
    $content .= "INSURANCE HISTORY\n";
    $content .= "================================\n";
    $content .= "Had Columbia Insurance: " . (($data['hadColumbiaInsurance'] ?? false) ? 'Yes' : 'No') . "\n";
    $content .= "Previous Policy Numbers: " . ($data['previousPolicyNumbers'] ?? 'N/A') . "\n";
    $content .= "Previous Effective Dates: " . ($data['previousEffectiveDates'] ?? 'N/A') . "\n";
    $content .= $priorInsuranceText ?: "No prior insurance records\n";
    $content .= "Aware of Claims: " . (($data['awareOfClaims'] ?? false) ? 'Yes' : 'No') . "\n";
    $content .= "Claim Details: " . ($data['claimDetails'] ?? 'N/A') . "\n";
    $content .= "Declined Insurance: " . (($data['declinedInsurance'] ?? false) ? 'Yes' : 'No') . "\n";
    $content .= "Declined Reason: " . ($data['declinedReason'] ?? 'N/A') . "\n\n";
    
    $content .= "================================\n";
    $content .= "DRIVE-AWAY OPERATIONS\n";
    $content .= "================================\n";
    $content .= "Unit Types: " . ($data['unitTypes'] ?? '') . "\n";
    $content .= "New Units %: " . ($data['newUnitsPercentage'] ?? 'Not specified') . "\n";
    $content .= "Used Units %: " . ($data['usedUnitsPercentage'] ?? 'Not specified') . "\n";
    $content .= "Payment Method: " . ($data['paymentMethod'] ?? '') . "\n";
    $content .= "Rate Per Mile: " . ($data['ratePerMile'] ?? 'N/A') . "\n";
    $content .= "Rate Per Trip: " . ($data['ratePerTrip'] ?? 'N/A') . "\n";
    $content .= "Full Time Drivers: " . ($data['fullTimeDrivers'] ?? 'Not specified') . "\n";
    $content .= "Part Time Drivers: " . ($data['partTimeDrivers'] ?? 'Not specified') . "\n";
    $content .= "Trips Per Week: " . ($data['tripsPerWeek'] ?? 'Not specified') . "\n";
    $content .= "Max Radius: " . ($data['maxRadius'] ?? 'Not specified') . "\n";
    $content .= "Average Radius: " . ($data['averageRadius'] ?? 'Not specified') . "\n";
    $content .= "Annual Mileage: " . ($data['annualMileage'] ?? 'Not specified') . "\n";
    $content .= "Pickup Locations: " . ($data['pickupLocations'] ?? '') . "\n";
    $content .= "Delivery Locations: " . ($data['deliveryLocations'] ?? '') . "\n";
    $content .= "Client List: " . ($data['clientList'] ?? 'Not provided') . "\n";
    $content .= "Deliver Both Ways: " . (($data['deliverBothWays'] ?? false) ? 'Yes' : 'No') . "\n";
    $content .= "Return Trip Handling: " . ($data['returnTripHandling'] ?? 'Not provided') . "\n";
    $content .= "Has Other Operations: " . (($data['hasOtherOperations'] ?? false) ? 'Yes' : 'No') . "\n";
    $content .= "Other Operations: " . ($data['otherOperations'] ?? 'N/A') . "\n\n";
    
    // Additional sections (plate info, vehicle details, etc.)
    if ($data['requiredToUsePlates'] ?? false) {
        $content .= "================================\n";
        $content .= "PLATE INFORMATION\n";
        $content .= "================================\n";
        $content .= "Total Plates: " . ($data['totalNumberOfPlates'] ?? 'Not specified') . "\n";
        $content .= "Plate Type: " . ($data['plateType'] ?? 'Not specified') . "\n";
        $content .= "Plates Per Unit: " . ($data['platesPerUnit'] ?? 'Not specified') . "\n";
        $content .= "Average In Use: " . ($data['averagePlatesInUse'] ?? 'Not specified') . "\n";
        $content .= "All Plates Insured: " . (($data['allPlatesInsured'] ?? false) ? 'Yes' : 'No') . "\n\n";
    }
    
    $content .= "==========================================\n";
    $content .= "END OF APPLICATION - $application_number\n";
    $content .= "==========================================\n";
    $content .= "Processed by: " . ($_SERVER['SERVER_NAME'] ?? 'Unknown Server') . "\n";
    $content .= "User Agent: " . ($_SERVER['HTTP_USER_AGENT'] ?? 'Unknown') . "\n";
    $content .= "IP Address: " . ($_SERVER['REMOTE_ADDR'] ?? 'Unknown') . "\n";
    
    return $content;
}
?>