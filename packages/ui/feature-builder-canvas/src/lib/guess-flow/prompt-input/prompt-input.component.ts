import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-prompt-input',
  templateUrl: './prompt-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromptInputComponent implements AfterViewInit{
  @ViewChild('inputDiv',{read:ElementRef})
  inputDiv:ElementRef<HTMLElement>;
  ngAfterViewInit(): void {
  
   this.inputDiv.nativeElement.focus();
  }
  guess={value:''};
  guessStyling = {'line-height':'68px', 'font-size':'50px', 'font-weight':'600'};
  stylingLimits ={
    oneLine:{
      'line-height':'68px',
      'font-size':'50px',
      'font-weight':'600'
    },
    twoLines :
    {
      'line-height':'41px',
      'font-size':'30px',
      'font-weight':'600'
    },
    moreThanTwoLines:
    {
      'line-height':'27px',
      'font-size':'20px',
      'font-weight':'400'
    }
  }
  changeGuessValue()
  {
    this.guess = {value:this.inputDiv.nativeElement.textContent || ''};
    this.calculateInputStyle();
  }
  paste($event:ClipboardEvent)
  {
 
    //Disallow HTML pasting
    $event.preventDefault();
    const clipboard = $event.clipboardData?.getData("text");
    const selection = window.getSelection()!;
    if (!selection.rangeCount) return;
    selection.deleteFromDocument();
    selection.getRangeAt(0).insertNode(document.createTextNode(clipboard || ''));
    selection.collapseToEnd();
    this.guess = this.inputDiv.nativeElement.textContent ?{value:this.inputDiv.nativeElement.textContent} : {value:''};
    this.calculateInputStyle();
  }

  calculateInputStyle()
  {
    if(this.guess.value.length <=38)
    {
      this.guessStyling = this.stylingLimits.oneLine;
    }
    else if(this.guess.value.length > 38 && this.guess.value.length < 76 )
    {
      this.guessStyling = this.stylingLimits.twoLines;
    }
    else
    {
      this.guessStyling = this.stylingLimits.moreThanTwoLines
    }
  }
}