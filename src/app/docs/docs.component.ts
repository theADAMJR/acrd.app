import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import marked from 'marked';

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.css']
})
export class DocsComponent implements OnInit {
  defaultPage = 'setup';

  get markdownPagePath() {
    const page = this.route.snapshot.paramMap
      .get('page')?.toLowerCase() || this.defaultPage;      
    return `assets/docs/${page}.md`;
  }

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    router: Router) {
    const page = route.snapshot.paramMap.get('page')?.toLowerCase();
    if (!page)
      router.navigate([`/docs/${this.defaultPage}`]);
  }

  async ngOnInit() {
    await this.convertToMarkdown();  
  }

  async convertToMarkdown() {
    const file = await fetch(this.markdownPagePath);
    const md = await file.text();
    
    document.getElementById('doc').innerHTML = marked(md);
  }
}
