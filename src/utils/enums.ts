export enum Environment {
	PRODUCTION = "production",
	DEVELOPMENT = "development",
	TEST = "test",
}

export enum Language {
	ENGLISH = "en",
	GUJARATI = "gu",
}

export enum Gender {
	MALE = "male",
	FEMALE = "female",
}

export enum MaritalStatus {
	SINGLE = "single",
	MARRIED = "married",
	ENGAGED = "engaged",
	SEPARATED = "separated",
	DIVORCED = "divorced",
	WIDOW = "widow",
}

export enum ClientType {
	BROWSER = "browser",
	ANDROID = "android",
	IOS = "ios",
}

export enum MemberType {
	CORE = "core",
	MAINTAINER = "maintainer",
}

export enum OccupationType {
	SERVICE = "service",
	SELF_EMPLOYED = "self_employed",
	BUSINESS = "business",
	INVESTOR = "investor",
}

export enum AcademicLevel {
	DIPLOMA = "diploma",
	GRADUATION = "graduation",
	POST_GRADUATION = "post_graduation",
	DOCTORATE = "doctorate",
}

export enum AnnualIncomeClass {
	LESS_1_LAC = "less_1_lac",
	BET_1_AND_5_LAC = "bet_1_and_5_lac",
	BET_5_AND_10_LAC = "bet_5_and_10_lac",
	BET_10_AND_20_LAC = "bet_10_and_20_lac",
	BET_20_AND_40_LAC = "bet_20_and_40_lac",
	BET_40_AND_80_LAC = "bet_40_and_80_lac",
	MORE_80_LAC = "more_80_lac",
}

export enum ChannelType {
	MAIN = "main",
	OTHER = "other",
}

export enum PaymentGatewayProvider {
	RAZORPAY = "razorpay",
}

export enum ProfileTransactionPurpose {
	MATRIMONY_SUBSCRIPTION = "matrimony_subscription",
}

export enum TransactionStatus {
	PENDING = "pending",
	DONE = "done",
	FAILED = "failed",
}

export enum PaymentIntentStatus {
	CREATED = "created",
	ATTEMPTED = "attempted",
	PAID = "paid",
}

export enum ProfileRelationType {
	FATHER = "father",
	MOTHER = "mother",
	SPOUSE = "spouse",
	SIBLING = "sibling",
	CHILD = "child",
}

export enum ReviewStatus {
	PENDING = "pending",
	IN_REVIEW = "in_review",
	REJECTED = "rejected",
	APPROVED = "approved",
}
