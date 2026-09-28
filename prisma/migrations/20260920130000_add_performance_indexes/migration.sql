-- Performance indexes: columns used in frequent WHERE/ORDER BY clauses
-- (admin appointment status filters, boolean content flags, FAQ ordering)
-- and foreign key columns that had no index at all (Prisma does not add
-- one automatically for these optional relations).

-- Doctor
CREATE INDEX "Doctor_isFeatured_idx" ON "Doctor"("isFeatured");

-- Condition
CREATE INDEX "Condition_category_idx" ON "Condition"("category");
CREATE INDEX "Condition_reviewedByDoctorId_idx" ON "Condition"("reviewedByDoctorId");

-- Procedure
CREATE INDEX "Procedure_conditionId_idx" ON "Procedure"("conditionId");
CREATE INDEX "Procedure_doctorId_idx" ON "Procedure"("doctorId");

-- LocationLandingPage
CREATE INDEX "LocationLandingPage_conditionId_idx" ON "LocationLandingPage"("conditionId");

-- Faq
CREATE INDEX "Faq_conditionId_idx" ON "Faq"("conditionId");
CREATE INDEX "Faq_pageContext_sortOrder_idx" ON "Faq"("pageContext", "sortOrder");

-- Testimonial
CREATE INDEX "Testimonial_conditionId_idx" ON "Testimonial"("conditionId");
CREATE INDEX "Testimonial_doctorId_idx" ON "Testimonial"("doctorId");
CREATE INDEX "Testimonial_isApproved_idx" ON "Testimonial"("isApproved");
CREATE INDEX "Testimonial_isFeatured_idx" ON "Testimonial"("isFeatured");

-- MediaItem
CREATE INDEX "MediaItem_category_sortOrder_idx" ON "MediaItem"("category", "sortOrder");

-- Appointment
CREATE INDEX "Appointment_status_idx" ON "Appointment"("status");
CREATE INDEX "Appointment_createdAt_idx" ON "Appointment"("createdAt");
CREATE INDEX "Appointment_conditionId_idx" ON "Appointment"("conditionId");
CREATE INDEX "Appointment_doctorId_idx" ON "Appointment"("doctorId");

-- SymptomCheckSession
CREATE INDEX "SymptomCheckSession_conditionGuessId_idx" ON "SymptomCheckSession"("conditionGuessId");

-- BlogPost
CREATE INDEX "BlogPost_isPublished_idx" ON "BlogPost"("isPublished");
CREATE INDEX "BlogPost_reviewedByDoctorId_idx" ON "BlogPost"("reviewedByDoctorId");

-- CostEstimatorRule
CREATE INDEX "CostEstimatorRule_procedureId_idx" ON "CostEstimatorRule"("procedureId");
CREATE INDEX "CostEstimatorRule_conditionId_idx" ON "CostEstimatorRule"("conditionId");

-- Location
CREATE INDEX "Location_isPrimary_idx" ON "Location"("isPrimary");
