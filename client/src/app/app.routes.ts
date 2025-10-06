import { AuthGuard } from './common/authentication/guard/auth.guard';

import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BlogComponent } from './blog/blog.component';
import { BlogPostComponent } from './blog/post/blog-post.component';
import { PastWinnersComponent } from './past-winners/past-winners.component';
import { FaqsComponent } from './utility/faqs/faqs.component';
import { LoginComponent } from './common/authentication/login/login.component';
import { SignupComponent } from './common/authentication/signup/signup.component';
import { ForgotPasswordComponent } from './common/authentication/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './common/authentication/reset-password/reset-password.component';
import { TermsComponent } from './utility/terms/terms.component';
import { PrivacyComponent } from './utility/privacy/privacy.component';
import { ErrorComponent } from './utility/error/error.component';
import { ContactComponent } from './utility/contact/contact.component';

// USER
import { SubscriptionDashboardComponent } from './user/subscription/dashboard/subscription-dashboard.component';
import { SubscriptionManageComponent } from './user/subscription/manage/subscription-manage.component';
import { ProfileSettingComponent } from './user/profile-setting/profile-setting.component';
import { ValidateEmailComponent } from './components/validate-email/validate-email.component';
import { SuccessComponent } from './user/components/success/success.component';
import { FailureComponent } from './user/components/failure/failure.component';

// ADMIN
import { ManagePostsComponent } from './admin/blog/manage-posts.component';
import { AddBlogPostComponent } from './admin/blog/add-blog-post/add-blog-post.component';
import { ManageWinnersComponent } from './admin/winner/manage-winners.component';
import { AddWinnerComponent } from './admin/winner/add-winner/add-winner.component';
import { AdminSubscriptionsComponent } from './admin/subscription/admin-subscriptions.component';
import { AdminSubscriptionDetailComponent } from './admin/subscription/subscription-detail/admin-subscription-detail.component';
import { ErrorsComponent } from './admin/errors/errors.component';

export const routes: Routes = [
	{'path':'', component:HomeComponent},
	{'path':'blog', component:BlogComponent},
	{'path':'blog-post/:id', component:BlogPostComponent},
	{'path':'past-winners', component:PastWinnersComponent},
	{'path':'faqs', component:FaqsComponent},
	{'path':'login', component:LoginComponent},
	{'path':'signup', component:SignupComponent},
	{'path':'forgot-password', component:ForgotPasswordComponent},
	{'path':'reset-password/:reset_token', component: ResetPasswordComponent },
  {'path':'validate-email/:validation_token', component: ValidateEmailComponent },
	{'path':'terms', component:TermsComponent},
	{'path':'privacy', component:PrivacyComponent},
	{'path':'404', component:ErrorComponent},
	{'path':'contact', component:ContactComponent},
	{'path':'error', component:ErrorComponent},

	// USER
	{'path':'user', component:SubscriptionDashboardComponent, canActivate: [AuthGuard], data: { roles: ['client']}},
	{'path':'user/profile-settings', component:ProfileSettingComponent, canActivate: [AuthGuard], data: { roles: ['client']}},
	{'path':'user/subscription-dashboard', component:SubscriptionDashboardComponent, canActivate: [AuthGuard], data: { roles: ['client']}},
	{'path':'user/subscription-manage', component:SubscriptionManageComponent, canActivate: [AuthGuard], data: { roles: ['client']}},
	{'path':'user/subscribe/success', component: SuccessComponent },
  {'path':'user/subscribe/failure', component: FailureComponent },
	{'path':'user/faqs', component:FaqsComponent, canActivate: [AuthGuard], data: { roles: ['client']}},
	{'path':'user/privacy', component:PrivacyComponent, canActivate: [AuthGuard], data: { roles: ['client']}},
	{'path':'user/terms', component:TermsComponent, canActivate: [AuthGuard], data: { roles: ['client']}},

	// ADMIN
	{'path':'admin', component:ManagePostsComponent, canActivate: [AuthGuard], data: { roles: ['sa']}},
	{'path':'admin/add-blog-post', component:AddBlogPostComponent, canActivate: [AuthGuard], data: { roles: ['sa']}},
	{'path':'admin/edit-blog-post/:id', component:AddBlogPostComponent, canActivate: [AuthGuard], data: { roles: ['sa']}},
	{'path':'admin/manage-posts', component:ManagePostsComponent, canActivate: [AuthGuard], data: { roles: ['sa']}},
	{'path':'admin/add-winner', component:AddWinnerComponent, canActivate: [AuthGuard], data: { roles: ['sa']}},
	{'path':'admin/edit-winner/:id', component:AddWinnerComponent, canActivate: [AuthGuard], data: { roles: ['sa']}},
	{'path':'admin/manage-winners', component:ManageWinnersComponent, canActivate: [AuthGuard], data: { roles: ['sa']}},
	{'path':'admin/admin-subscriptions', component:AdminSubscriptionsComponent, canActivate: [AuthGuard], data: { roles: ['sa']}},
	{'path':'admin/admin-subscription-detail/:id', component:AdminSubscriptionDetailComponent, canActivate: [AuthGuard], data: { roles: ['sa']}},
	{'path':'admin/errors', component: ErrorsComponent, canActivate: [AuthGuard], data: { roles: ['sa']}},

	// ----------------------------------------- REDIRECT ----------------------------------------- //
  { path: '**', redirectTo: 'error' }

];
