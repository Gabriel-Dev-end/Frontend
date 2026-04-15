import { Route, Routes } from "@angular/router";
import { LoginComponent } from "@features/auth/pages/login/login.component";
import { ProductListComponent } from "@features/products/pages/product-list/product-list.component";
import { authGuard } from "@core/guards/auth.guard";

export const routes: Routes = [
    {
        path:'login',
        component:LoginComponent
    },
    {
        path:'products',
        component:ProductListComponent,
        canActivate:[authGuard]
    },
    {
        path:'',
        redirectTo:'/login',
        pathMatch:'full'
    },
    {
        path:'**',
        redirectTo:'/login'
    }
]