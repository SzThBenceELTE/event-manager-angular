import { Component } from "@angular/core";
import { RouterLink, RouterOutlet } from '@angular/router';
// import { AuthService } from "../../services/auth/auth.service";
// import { Router } from "@angular/router";


@Component({
    selector: "app-login",
    templateUrl: "./home-page.component.html",
    // styleUrls: ["./home-page.component.css"],
    standalone: true,
    imports: [RouterOutlet, RouterLink],
})
export class HomePageComponent {
    // constructor(private router: Router) {}
}