#!/bin/bash
sed -i '' 's/imports: \[\]/imports: \[MongooseModule.forFeature(\[{ name: User.name, schema: UserSchema }\])\]/' src/users/users.module.ts
sed -i '' '1i\
import { MongooseModule } from '\''@nestjs/mongoose'\'';\
import { User, UserSchema } from '\''./schemas/user.schema'\'';\
' src/users/users.module.ts

sed -i '' 's/imports: \[\]/imports: \[MongooseModule.forFeature(\[{ name: Profile.name, schema: ProfileSchema }\])\]/' src/profiles/profiles.module.ts
sed -i '' '1i\
import { MongooseModule } from '\''@nestjs/mongoose'\'';\
import { Profile, ProfileSchema } from '\''./schemas/profile.schema'\'';\
' src/profiles/profiles.module.ts

sed -i '' 's/imports: \[\]/imports: \[MongooseModule.forFeature(\[{ name: Interest.name, schema: InterestSchema }\])\]/' src/interests/interests.module.ts
sed -i '' '1i\
import { MongooseModule } from '\''@nestjs/mongoose'\'';\
import { Interest, InterestSchema } from '\''./schemas/interest.schema'\'';\
' src/interests/interests.module.ts

sed -i '' 's/imports: \[\]/imports: \[MongooseModule.forFeature(\[{ name: Swipe.name, schema: SwipeSchema }, { name: Match.name, schema: MatchSchema }\])\]/' src/swipes/swipes.module.ts
sed -i '' '1i\
import { MongooseModule } from '\''@nestjs/mongoose'\'';\
import { Swipe, SwipeSchema } from '\''./schemas/swipe.schema'\'';\
import { Match, MatchSchema } from '\''../matches/schemas/match.schema'\'';\
' src/swipes/swipes.module.ts

sed -i '' 's/imports: \[\]/imports: \[MongooseModule.forFeature(\[{ name: Match.name, schema: MatchSchema }\])\]/' src/matches/matches.module.ts
sed -i '' '1i\
import { MongooseModule } from '\''@nestjs/mongoose'\'';\
import { Match, MatchSchema } from '\''./schemas/match.schema'\'';\
' src/matches/matches.module.ts

sed -i '' 's/imports: \[\]/imports: \[MongooseModule.forFeature(\[{ name: MatchRequest.name, schema: MatchRequestSchema }\])\]/' src/requests/requests.module.ts
sed -i '' '1i\
import { MongooseModule } from '\''@nestjs/mongoose'\'';\
import { MatchRequest, MatchRequestSchema } from '\''./schemas/match-request.schema'\'';\
' src/requests/requests.module.ts

sed -i '' 's/imports: \[\]/imports: \[MongooseModule.forFeature(\[{ name: Notification.name, schema: NotificationSchema }\])\]/' src/notifications/notifications.module.ts
sed -i '' '1i\
import { MongooseModule } from '\''@nestjs/mongoose'\'';\
import { Notification, NotificationSchema } from '\''./schemas/notification.schema'\'';\
' src/notifications/notifications.module.ts

sed -i '' 's/imports: \[\]/imports: \[MongooseModule.forFeature(\[{ name: BlockedUser.name, schema: BlockedUserSchema }\])\]/' src/blocks/blocks.module.ts
sed -i '' '1i\
import { MongooseModule } from '\''@nestjs/mongoose'\'';\
import { BlockedUser, BlockedUserSchema } from '\''./schemas/blocked-user.schema'\'';\
' src/blocks/blocks.module.ts

sed -i '' 's/imports: \[\]/imports: \[MongooseModule.forFeature(\[{ name: Report.name, schema: ReportSchema }\])\]/' src/reports/reports.module.ts
sed -i '' '1i\
import { MongooseModule } from '\''@nestjs/mongoose'\'';\
import { Report, ReportSchema } from '\''./schemas/report.schema'\'';\
' src/reports/reports.module.ts
