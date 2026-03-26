import { Routes } from '@angular/router';
import { PostItem } from './features/post-item/post-item';
import { Dashboard } from './features/dashboard/dashboard';
import { LostFound } from './lost-found/lost-found';

export const routes: Routes = [
    {
        path:'',
        component:Dashboard,
    },
    {
        path:'post-item',
        component:PostItem,
    },
    {path:'admin',
     component:Dashboard,

    },
    {
        path:'student',
        component:LostFound,
    }

];
