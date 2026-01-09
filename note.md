Table: Tenders
This stores the primary info for the project.

id (Primary Key, UUID)
title (String)
description (Text)
block_type (Enum: Urban, Rural, etc.)
total_phases (Integer)
status (Enum: Active, Revoked)
created_at (Timestamp)

Table: Phase_Criteria
This stores the criteria for every phase linked to a tender.
id (Primary Key)
tender_id (Foreign Key -> Tenders.id)
phase_number (Integer - e.g., 1, 2, 3...)
has_procurement (Boolean)
has_pillar_setup (Boolean)
has_audit (Boolean)