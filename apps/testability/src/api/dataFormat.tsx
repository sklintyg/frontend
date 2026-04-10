import { A } from "vitest/dist/chunks/environment.d.cL3nLXbE";

export interface CareUnit {
    hsaId: string;
    name: string;
}

export interface PaginatedCertificatesDto {
    data: CertificateDto[],
    total: number
}

export interface CertificateDto{
        certificateId: string,
        patientName: string,
        personNumber: string,
        unitName: string,
        certificateType: string,
        certificateTypeVersion: string,
        createdBy: string,
        dateSigned: string
}

export interface MessageDto {
        key: string,
        messageId: string,
        reference: string,
        subject: string,
        content: string,
        author: string,
        created: string,
        modified: string,
        sent: string,
        forwarded: string,
        messageTypeKey: string,
        messageStatusKey: string,
        lastDateToReply: string,
        authoredByStaffKey: string,
        certificateKey: string
}


// Data transfer objects for sending messages to the care system

export enum Amneskod {
        AVSTMN = "AVSTMN",
        KONTACT = "KONTAKT",
        PAMIN = "PAMIN",
        OVRIGT = "OVRIGT",
        KOMPLT = "KOMPLT",
        SVARFRAGEREFERENS = "SVARFRAGEREFERENS"
}

export interface AmnesKodDto {
        code: Amneskod,
        displayName: string
}

export interface IntygsId {
        root: string,
        extension: string
}

export interface KompletteringRequestDto {
        frageId: string,         // Question ID (e.g., "8.1", "6.2")
        instans: number,        // Instance number if question repeats (optional)
        text: string             // What information/clarification is requested
}

export interface PartKodDto {
        code: string,
        codeSystem: string,
        displayName: string
}

export interface PersonIdDto {
        extension: string //Personnummer
}

export interface SkickatAvDto {
        part: PartKodDto,
        kontaktInfo: string[]
}

export interface MeddelandeReferensDto {
        meddelandeId: string,    // ID of the message being referenced
        referensId: string      // Type of reference (e.g., "AVSTMN", "SVARFRAGEREFERENS")
}

export interface SendMessageToCareDto {
        meddelandeId: string,                    // Unique message ID (UUID)
        skickatTidpunkt: string,          // Timestamp when sent
        intygsId: IntygsId,                    // Certificate ID
        patientPersonId: PersonIdDto,            // Patient ID
        logiskAdressMottagare: string,           // Recipient logical address (HSA ID)
        amne: AmnesKodDto,                       // Message type/topic
        meddelande: string,                      // Message body text
        skickatAv: SkickatAvDto,                 // Sender information
        referensId?: string,                      // External reference ID
        rubrik?: string,                          // Subject/title
        sistaDatumForSvar?: string,            // Deadline for response (AVSTMN, SVARFRAGEREFERENS)
        paminnelseMeddelandeId?: string,          // ID of original message (PAMIN only)
        komplettering?: KompletteringRequestDto[],  // Completion requests (KOMPLT only, repeatable)
        svarPa?: MeddelandeReferensDto            // Reference to original inquiry (SVARFRAGEREFERENS only)
}
