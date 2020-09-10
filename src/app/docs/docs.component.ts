import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import marked from 'marked';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.css']
})
export class DocsComponent implements OnInit {
  defaultPage = 'get-started';

  get markdownPagePath$() {
    return this.route.paramMap.pipe(
      map(paramMap => {
        const page = paramMap.get('page')?.toLowerCase() || this.defaultPage;      
        return `assets/docs/${page}.md`;
    }));
  }

  constructor(
    private route: ActivatedRoute,
    router: Router) {
    route.paramMap.subscribe(paramMap => {      
      const page = paramMap.get('page')?.toLowerCase();
      if (!page)
        router.navigate([`/docs/${this.defaultPage}`]);
    });
  }

  async ngOnInit() {
    await this.convertToMarkdown();  
  }

  async convertToMarkdown() {
    this.markdownPagePath$.subscribe(async(path) => {      
      const file = await fetch(path);
      const md = await file.text();
      
      document.getElementById('doc').innerHTML = marked(md, { breaks: true });
      document.querySelector('h1').classList.add('display-3');
    });
  }
}
