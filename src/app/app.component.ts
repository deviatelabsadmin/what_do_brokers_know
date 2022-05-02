import { AfterViewChecked, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Typed } from 'typed.ts';
import { OnInit } from '@angular/core';
import { GeolocateService } from './geolocate.service';
import { ApiService } from './api.service';

const EMAIL_PROMPT = "Enter your email to get started > ".toUpperCase();

const INIT_TEXT =  
  `**********************************************
   ****************** CADEN.IO ******************
   ************ WHAT DO DATA BROKERS ************
   *************** KNOW ABOUT ME? ***************
   **********************************************`

const LOAD_TEXT = `LOADING DATA BROKER DATABASE...`;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewChecked {
  @ViewChild('input') private inputField!: ElementRef;
  
  typedText: Array<any> = [];
  typingText: string = '';
  readyForInput: boolean = false;
  prefixText: string = EMAIL_PROMPT;
  inputText: string = '';
  isEmailSubmitted = false;
  data: any;
  instagramData: any;
  currentIndex = 0;
  currentScrollHeight = document.documentElement.scrollHeight;
  failedEmail: boolean = false;
  typingColor: string = '#c3ef8f'
  isOptOutPrompt: boolean = false;
  isTermsPrompt: boolean = true;
  isLoadingIg: boolean = false;
  email: string = '';

  typed: Typed = new Typed({callback: (text) => this.typingText = text});
  
  @HostListener('window:keyup', ['$event'])
  async keyEvent(event: KeyboardEvent) {
    if (this.readyForInput) {
      switch (event.key) {
        case 'Enter':
          await this.submit();
          break;
        case 'Escape':
          await this.rickroll();
          break;
      }
    }    
  }

  get typedKeys() {
    return this.typedText.keys();
  }

  constructor(private geo: GeolocateService, private api: ApiService) {}

  async ngOnInit() {
    await this.initialType();
  }

  scroll() {
    const h = document.documentElement.scrollHeight;

    if (h != this.currentScrollHeight) {
      this.currentScrollHeight = h;
      window.scroll(0, h);
    }
  }

  async ngAfterViewChecked() {
    try {
      this.scroll();

      if (this.inputField) {
        this.inputField.nativeElement.focus();
      }
    } catch(err) {
      console.log(err);
    } 
  }

  async submit() {
    this.readyForInput = false;

    if (this.isTermsPrompt) {
      this.isTermsPrompt = false;

      let input = this.inputText.toLowerCase();
      if (input != 'no' && input != 'n' && input != 'y' && input != 'yes') {
        input = 'Yes';
      } else {
        input = this.inputText;
      }

      this.printInput(input);

      if (input.toLowerCase() == 'n' || input.toLowerCase() == 'no') {
        await this.terminate();
      } else {
        await this.promptInput(EMAIL_PROMPT);
      }

    } else if (this.isOptOutPrompt) {
      let input = this.inputText.toLowerCase();

      if (input != 'no' && input != 'n' && input != 'y' && input != 'yes') {
        input = 'No';
      } else {
        input = this.inputText;
      }

      this.printInput(input);

      if (input.toLowerCase() == 'y' || input.toLowerCase() == 'yes') {
        await this.api.optOut(this.email);
        await this.typeLine(`OK, YOU'VE SUCCESSFULLY OPTED OUT.`);
      } else {
        // todo
      }
    } else if (this.isEmailSubmitted) {
      await this.handleInput();
    } else if (!this.inputText.replace(/\s/g, '').length) {
      this.printInput(this.inputText);
      await this.promptInput(EMAIL_PROMPT);
    } else {
      await this.submitEmail()
    }
  }

  private printInput(input: string) {
    this.typedText.push({
      text: [
        {
          text: this.prefixText,
          color: '#c3ef8f'
        },
        {
          text: input,
          color: '#16fe21'
        }
      ]
    });
  }

  private async handleInput() {
    let input = this.inputText.toLowerCase();
    if (input != 'no' && input != 'n' && input != 'y' && input != 'yes') {
      input = 'Yes';
    } else {
      input = this.inputText;
    }

    this.typedText.push({
      text: [
        {
          text: this.prefixText,
          color: '#c3ef8f'
        },
        {
          text: input,
          color: '#16fe21'
        }
      ]
    });
    
    if (input.toLowerCase() == 'no' || input.toLowerCase() == 'n') {
      await this.terminate();
    } else {
      await this.typeNextData();
    }
  }

  private async failedTerminate() {
    await this.addLine('TERMINATING C:\\\\creep.exe', '#f32a9d');
    await this.addLine('TERMINATED.', '#16fe21');

    await this.addLine(`Well look at that, we couldn’t find you! (yet)`);
    await this.addLine(`However, it may only be a matter of time before big data brokers slurp up your personal data and list it for sale on the open web for a fraction of a penny.`);
    await this.addLine(undefined, undefined, [
      {
        text: `We're `
      },
      {
        text: 'Caden',
        link: 'https://www.caden.io'
      },
      {
        text: `, are a startup in NYC that is building a platform to help you control, own, protect and make money off your data, all while protecting your privacy. The internet is riddled with all sorts of problems and we are working to make the internet a better place.`
      }
    ]);
    await this.addLine(`We’ll let you know when our Beta launches this summer.`);
    await this.addLine(undefined, undefined, [
      {
        text: `You can also follow our journey on `
      },
      {
        text: 'Instagram',
        link: 'https://www.instagram.com/caden.io'
      },
      {
        text: ' and '
      },
      {
        text: 'Twitter',
        link: 'https://twitter.com/cadenhq'
      },
      {
        text: '.'
      }
    ]);
    await this.typeShare();
    await this.promptOptOut();
  }

  private async terminate() {
    await this.addLine('TERMINATING C:\\\\creep.exe', 'red');
    await this.addLine('TERMINATED.', '#16fe21');

    await this.addLine(`Want to know WTF just happened?`);
    await this.addLine(`This is just a tiny snapshot of your data that is for sale on the open web. It cost us a fraction of a penny to buy.`);
    await this.addLine(undefined, undefined, [
      {
        text: `We're `
      },
      {
        text: 'Caden',
        link: 'https://www.caden.io'
      },
      {
        text: `, a startup in NYC that is building a platform to help folks like you control, own, protect and make money off your data, all while protecting your privacy. The internet is riddled with all sorts of problems and we are working to make the internet a better place.`
      }
    ]);
    await this.addLine(`We’ll let you know when our Beta launches this summer.`);
    await this.addLine(undefined, undefined, [
      {
        text: `You can also follow our journey on `
      },
      {
        text: 'Instagram',
        link: 'https://www.instagram.com/caden.io'
      },
      {
        text: ' and '
      },
      {
        text: 'Twitter',
        link: 'https://twitter.com/cadenhq'
      },
      {
        text: '.'
      }
    ]);
    await this.addLine(`Don’t worry, we didn’t do anything nefarious with the data we showed you above. This was just a creepy art project to demonstrate one of many issues around personal data and the endless surveillance that you never signed up for.`)
    await this.addLine(`We look forward to solving these problems together.`);
    await this.typeShare();
    await this.promptOptOut();
  }

  get isValidEmail(): boolean {
    return new Boolean(this.inputText.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )).valueOf();
  }

  private async submitEmail() {
    this.email = this.inputText.toLowerCase();
    
    this.typedText.push({
      text: [
        {
          text: this.prefixText, 
          color: '#c3ef8f'
        }, 
        {
          text: this.inputText, 
          color: '#16fe21'
        }
      ]
    });

    if (this.isValidEmail) {
      await this.typeLine('SEARCHING...', undefined, 'lightsea#16fe21');
      await this.pullData();
      await this.typeLine('BUYING YOUR DATA...', undefined, 'lightsea#16fe21');
  
      if (this.hasData) {
        this.pullDataSuccess(); 
      } else {
        // Second failed email
        if (this.failedEmail) {
          await this.failedTerminate();
        } else {
            // request another email
          if (this.data && this.data.name) {
            this.typedText.push({
              text: [{
                text: `WOW, ${this.data.name}... YOU'RE WELL HIDDEN! WE COULDN'T BUY ANY DATA.`,
                color: '#c3ef8f'
              }]
            });
          } else {
            this.typedText.push({
              text: [{
                text: `WOW... YOU'RE WELL HIDDEN! WE COULDN'T BUY ANY DATA.`,
                color: '#c3ef8f'
              }]
            });
          }
          
  
          this.isEmailSubmitted = false;
          this.failedEmail = true;
          this.promptInput('TRY ANOTHER EMAIL ADDRESS > ');
        }
      }
    } else {
      // invalid email format
      await this.invalidEmailPrompt();
    }
  }

  private async invalidEmailPrompt() {
    await this.typeLine(`WHAT'S '${this.inputText}'? DOESN'T LOOK LIKE AN EMAIL ADDRESS 🤔`, [
      {
        text: `WHAT'S '`
      },
      {
        text: this.inputText,
        color: '#f32a9d'
      },
      {
        text: `'? DOESN'T LOOK LIKE AN EMAIL ADDRESS 🤔`
      }
    ]);
    await this.promptInput(`LET'S TRY AN ACTUAL EMAIL THIS TIME > `.toUpperCase());
  }

  private async pullDataSuccess() {
    if (this.data.name) {
      await this.typeLine(`OK ${this.data.name.toUpperCase()}, LET'S DO THIS...`, [
        {
          text: "OK ",
        }, {
          text: this.data.name.toUpperCase(),
          color: '#16fe21'
        }, {
          text: `, LET'S DO THIS...`
        }
      ]);
    }

    await this.typeLine(`WOW, THERE'S A LOT OUT THERE...`);
    await this.typeLine(`ANALYZING...`, undefined, '#16fe21');
    await this.typeLine(`ANALYZING...`, undefined, '#16fe21');
    await this.typeLine(`ANALYZING...`, undefined, '#16fe21');

    await this.typeNextData();

    this.isEmailSubmitted = true;
  }

  private async typeNextData() {
    switch(this.currentIndex) {
      case 0:
        if (this.hasNextDataAt(0)) {
          if (this.data.phones) {
            if (this.data.phones.length > 1) {
              await this.typeLine(`YOU'VE HAD QUITE A FEW PHONE NUMBERS...`);
            } else {
              await this.typeLine(`WE'VE FOUND YOUR PHONE NUMBER...`);
            }

            for (let p of this.data.phones) {
              await this.addLine(p, 'red');
            }

            await new Promise(f => setTimeout(f, 500));
          }

          if (this.data.hasPhone) {
            await this.typeLine('CHECK YOUR PHONE ;)', undefined, 'red');
            await new Promise(f => setTimeout(f, 500));
          }
  
          if (this.data.title) {
            await this.typeLine(`SO YOU'RE A ${this.data.title.toUpperCase()}... FANCY`, [
              {
                text: `SO YOU'RE A `
              }, 
              {
                text: this.data.title.toUpperCase(),
                color: '#16fe21'
              },
              {
                text: '... FANCY'
              }
            ]);
            await new Promise(f => setTimeout(f, 500));
          }
      
          if (this.data.addresses && this.data.addresses.length != 0) {
            if (this.data.addresses.length > 1) {
              await this.typeLine('REMEMBER LIVING IN ANY OF THESE PLACES?');
            } else {
              await this.typeLine('REMEMBER LIVING HERE?');
            }
            
            for (let ad of this.data.addresses) {
              await this.addLine(ad.toUpperCase(), 'red');
            }

            await new Promise(f => setTimeout(f, 500));
          }

          if (this.hasFutureData) {
            await this.typeLine('WANT TO SEE MORE?');
            await this.promptInput('[Y]es / [N]o, this is too creepy > ');
          } else {
            await this.typeLine(`OK, ENOUGH OF THAT, WE'RE OFFICIALLY CREEPED OUT.`)
            this.terminate();
          }
        } else {
          this.currentIndex++;
          await this.typeNextData();
        }

        break;
      case 1:
        if (this.hasNextDataAt(1)) {
          await this.typeAfterFirstPrompt();
        } else {
          this.currentIndex++;
          await this.typeNextData();
        }
        break;
      case 2:
        if (this.hasNextDataAt(2)) {
          await this.typeAfterSecondPrompt();
          this.currentIndex++;
        }
        break;
      default:
        break;
    }
    
    this.currentIndex++;
  }

  private hasNextDataAt(index: number): boolean {
    switch(index) {
      case 0:
        if (this.data.hasPhone) return true;
        if (this.data.phones) return true;
        if (this.data.title) return true;
        if (this.data.addresses && this.data.addresses.length != 0) return true;

        return false;
      case 1:
        if (this.data.birthday) return true;
        if (this.data.workplaces && this.data.workplaces.length != 0) return true;
        if (this.data.emails && this.data.emails.length != 0) return true;
        if (this.data.associates && this.data.associates.length != 0) return true;
        if (this.data.skills && this.data.skills.length != 0) return true;
        if (this.data.school && this.data.school.length != 0) return true;

        return false;
      case 2: 
        if (this.data.social_handles) return true;
        if (this.data.instagram && this.instagramData) return true;
        return false;      
      default: 
        return false;
    }
  }

  private get hasFutureData(): boolean {
    for (let i = this.currentIndex + 1; i < 4; i++) {
      if (this.hasNextDataAt(i)) {
        return true;
      }
    }

    return false;
  }

  private async typeAfterFirstPrompt() {
    if (this.data.birthday) {
      if (this.data.birthday.sign) {
        await this.typeLine(`ASTROLOGICAL SIGN: ${this.data.birthday.emoji}`);

        if (this.data.birthday.age) {
          await this.typeLine(`A ${this.data.birthday.age} YEAR OLD ${this.data.gender ? this.data.gender.toUpperCase() : ''} ${this.data.birthday.sign}? YOU MAY NEED A HUG TODAY.`);
          await this.typeLine(this.zodiacText(this.data.birthday.sign));
        }

        if (this.data.birthday.isCurrentZodiac) {
          await this.typeLine(`WOO! IT'S ${this.data.birthday.sign.toUpperCase()} SEASON!`);
        }
      }
      await new Promise(f => setTimeout(f, 500));
    }

    if (this.data.emails && this.data.emails.length != 0) {
      if (this.data.emails.length > 1) {
        await this.typeLine(`HOW COME YOU DIDN'T USE ONE OF YOUR OTHER EMAILS?`); 
      } else {
        await this.typeLine(`HOW COME YOU DIDN'T USE YOUR OTHER EMAIL?`);
      }

      for (let e of this.data.emails) {
        await this.addLine(e, 'red');
      }
      await new Promise(f => setTimeout(f, 500));
    }

    if (this.data.workplaces && this.data.workplaces.length != 0) {
      if (this.data.workplaces.length > 1) {
        await this.typeLine('THESE LOOK LIKE FUN PLACES TO WORK...');
      } else {
        await this.typeLine('THIS LOOKS LIKE A FUN PLACE TO WORK...');
      }
      

      for (let w of this.data.workplaces) {
        await this.addLine(w.toUpperCase(), 'red');
      }
      await new Promise(f => setTimeout(f, 500));
    }

    if (this.data.associates && this.data.associates.length != 0) {
      await this.typeLine('AND THESE LOOK LIKE FUN PEOPLE TO WORK WITH...');

      for (let assc of this.data.associates) {
        await this.addLine(assc.toUpperCase(), 'red');
      }
      await new Promise(f => setTimeout(f, 500));
    }

    if (this.data.skills && this.data.skills.length != 0) {
      await this.typeLine('HOPE YOUR WORK VALUES ALL THE AMAZING SKILLS YOU HAVE...');

      for (let s of this.data.skills) {
        await this.addLine(s.toUpperCase(), 'red');
      }
      await new Promise(f => setTimeout(f, 500));
    }

    if (this.data.school && this.data.school.length != 0) {
      await this.typeLine(`OH SMARTY PANTS, LOOKS LIKE YOUR SKILLS WERE HONED AT...`);

      for (let s of this.data.school) {
        await this.addLine(s.toUpperCase(), 'red');
      }

      await new Promise(f => setTimeout(f, 500));
    }

    if (this.hasFutureData) {
      await this.typeLine('WANT TO SEE MORE?');
      await this.promptInput('[Y]es... I think / [N]o, make it stop > ');
    } else {
      await this.typeLine(`Ok, enough of that, we're officially creeped out.`.toUpperCase())
      this.terminate();
    }
  }

  private async typeAfterSecondPrompt() {
    await this.typeLine(`WE'RE GOING IN!`);

    if (this.data.social_handles) {
      await this.typeLine(`GENTLY CREEPING ON YOUR SOCIAL MEDIA...`);
      await this.typeLine('ANALYZING...', undefined, '#16fe21');

      for (let s of this.data.social_handles) {
        await this.addLine(`${s}`, 'red');
      }
      await new Promise(f => setTimeout(f, 500));
    }

    if (this.instagramData) {
      await this.typeLine(`LOOK FAMILIAR?`);

      this.typedText.push({
        isImage: true,
        src: this.instagramData.profile
      });

      await new Promise(f => setTimeout(f, 500));

      if (this.instagramData.posts && this.instagramData.posts.length != 0) {
        await this.typeLine(`HOW ABOUT THESE MEMORIES YOU'VE MADE?`);
        
        for (let i = 0; i < this.instagramData.posts.length; i++) {
           this.typedText.push({
            isImage: true,
            src: this.instagramData.posts[i]
          });

          await new Promise(f => setTimeout(f, 1000));
        }
      } else if (!this.instagramData.isPublic) {
        await this.typeLine(`HAVE YOU POSTED TO IG RECENTLY? YOU HAVE ${this.instagramData.followers} REASONS TO SHARE AN UPDATE`);
      }
    }

    await this.typeLine(`Ok, enough of that, we're officially creeped out.`.toUpperCase())
    await this.terminate();
  }


  // TODO pull real data
  private async pullData() {
    const res: any = await this.api.requestByEmail(this.inputText, false);

    if (res.hasOwnProperty('body') && Object.keys(res['body']).length != 0) {
      this.data = res['body'];

      if (this.data.instagram) {
        this.isLoadingIg = true;
        this.api.getInstagram(this.data.instagram).then((data: any) => {
          this.isLoadingIg = false;

          if (data['body'] && data['body']['profile']) {
            this.instagramData = data['body']
          }
        });
      }
    }
  }

  get hasData(): boolean {
    if (this.data && (Object.keys(this.data).length > 1 || !this.data.hasOwnProperty('name'))) { 
      return true;
    } else {
      return false;
    }
  }

  private promptInput(prefix?: string) {
    if (prefix) {
      this.prefixText = prefix;
    }

    this.inputText = '';
    this.readyForInput = true;
  }

  async initialType() {
    for (let str of INIT_TEXT.split('\n')) {
      await this.addLine(str);
    }

    await this.typeLine(LOAD_TEXT);
    await this.typeLine('LOADED.', undefined, '#16fe21');

    await this.typeGeoLocation();
    
    await this.addLine(undefined, undefined, [
      {
        text: 'DO YOU AGREE TO OUR '
      },
      {
        text: 'TERMS',
        link: 'https://www.caden.io/tos-terminal'
      },
      {
        text: '?'
      }
    ])

    this.promptInput("[Y]es / [N]o > ");
  }

  async typeShare() {
    await this.addLine('TELL A FRIEND ABOUT THIS PROJECT.');
    await this.addLine(undefined, undefined, [
      {
        text: `SHARE TO FACEBOOK`,
        link: 'https://www.facebook.com/sharer/sharer.php?u=ismydataforsale.com'
      }
    ]);
    await this.addLine(undefined, undefined, [
      {
        text: `SHARE TO TWITTER`,
        link: 'https://twitter.com/intent/tweet?url=http%3A%2F%2Fismydataforsale.com&text=What%20do%20data%20brokers%20know?'
      }
    ]);

    if (this.canNativeShare) {
      await this.addLine(undefined, undefined, [
        {
          text: 'Share',
          click: this.share,
        }
      ]);
    }
  }

  async typeGeoLocation() {
    try {
      const ip = await this.geo.getIpAddress();
      const locRes = await this.geo.getLocationFromIp(ip);
  
      const ipStr = "IP ADDRESS: " + ip;
      await this.typeLine(ipStr, [
        {
          text: "IP ADDRESS: "
        }, 
        {
          text: ip,
          color: '#f32a9d'
        }
      ]);
  
      const isVpn: boolean = this.geo.isVpn(locRes);
  
      if (!isVpn) {
        const l = this.geo.locationStr(locRes).toUpperCase();
        const locStr: string = "LOCATION: " + l;
        await this.typeLine(locStr, [
          {
            text: "LOCATION: "
          }, 
          {
            text: l,
            color: '#f32a9d'
          }
        ]);
      } else {
        const vpnStr = "IMPRESSIVE, YOU'RE USING A VPN?";
        await this.typeLine(vpnStr, undefined, '#16fe21');
      }
    } catch (e) {
      console.log(e);
    }
  }

  async addLine(line?: string, color?: string, styledLine?: Array<any>) {
    await new Promise(f => setTimeout(f, 500));

    if (color) {
      this.typingColor = color;
    }

    if (line) {
      this.typedText.push({
        text: [{
          text: line,
          color: color ? color : '#c3ef8f'
        }]
      });
    } else if (styledLine) {
      this.typedText.push({
        text: styledLine
      });
    }

    this.typingColor = '#c3ef8f'
  }

  async typeLine(line: string, typed?: Array<any>, color?: string) {
    if (color) {
      this.typingColor = color;
    }

    this.typed
      .type(line, {errorMultiplier: 0, noSpecialCharErrors: true, perLetterDelay: {min: 40, max: 40}});

    await this.typed.run();

    // await this.addElipses();
    await this.typed.reset(true);

    if (typed) {
      this.typedText.push({
        text: typed
      });
    } else {
      this.typedText.push({
        text: [{
          text: line,
          color: color ? color : '#c3ef8f'
        }]
      });
    }

    this.typingColor = '#c3ef8f';
  }

  async rickroll() {
    this.readyForInput = false;
    await this.typeLine('BOOTING UP SECONDARY PROCESS...', undefined, 'red');
    await this.typeLine('RUNNING C:\\\\rickroll.exe', undefined, '#16fe21');

    window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");

    await this.addLine('RESUMING C:\\\\creep.exe')
    await this.addLine(undefined, undefined, [{
      text: 'RESUMED.',
      color: '#16fe21'
    }]);
    
    this.readyForInput = true;
  }

  get canNativeShare(): boolean {
    const navigator = window.navigator as any;

    if (navigator.share) {
      return true;
    } else {
      return false;
    }
  }

  share() {
    const navigator = window.navigator as any;

    if (navigator.share) {
      navigator.share({title: "What Do Data Brokes Know?"});
    } else {

    }
  }

  get isMobileScreen(): boolean {
    if (window.screen.width <= 700) {
      return true;
    } else {
      return false;
    }
  }

  async promptOptOut() {
    this.isOptOutPrompt = true;
    await this.typeLine(`Get updates on how to protect your data and Caden's Beta, launching this summer.`.toUpperCase());
    await this.promptInput('[Y]es / [N]o > ');
  }

  zodiacText(sign: string): string {
    switch(sign) {
      case 'Aries':
        return 'Aries are passionate and independent. The most courageous of the signs, you must be the leader of every pack!'.toUpperCase();
      case 'Taurus':
        return 'Tauruses are the anchor of the Zodiac. You are a trustworthy friend, colleague, and partner.'.toUpperCase();
      case 'Gemini':
        return 'Geminis are easily the life of the party without trying, you still enjoy time by yourselves.'.toUpperCase();
      case 'Cancer':
        return 'Cancers are incredibly loyal but maybe to a fault? And let me guess you HATE small talk.'.toUpperCase();
      case 'Leo':
        return 'Leos love to bask in the spotlight and celebrate… well, themselves. :)'.toUpperCase();
      case 'Virgo':
        return 'Did someone say planner? Virgos are a friend for life and a lifelong learner, you love trying new things!'.toUpperCase();
      case 'Libra':
        return 'Libras are the master of compromise and diplomacy, you are always the mediator of friends.'.toUpperCase();
      case 'Scorpio':
          return 'Scorpios are unafraid to blaze your own trail, you make a statement where you go.'.toUpperCase();
      case 'Sagittarius':
        return 'Sagittariuses are open-hearted and big-spirited. You give great advice to friends and family!'.toUpperCase();
      case 'Capricorn':
        return 'Capricorns always get what they set their mind to. As someone who believes presentation is everything, everything you do is Insta-worthy!'.toUpperCase();
      case 'Aquarius':
        return 'Natural intellects who care deeply about others, Aquarians are always working to make the world a better place.'.toUpperCase();
      case 'Pisces':
        return 'Maybe the most sensitive and intuitive friend in the group, Pisces have a strong moral compass.'.toUpperCase();
      default:
        return '';            
    }
  }

  // async addElipses() {
  //   this.typed
  //     .type('...', {noSpecialCharErrors: true, perLetterDelay: {min: 20, max: 20}})
  //     .backspace(3)
  //     .type('...', {noSpecialCharErrors: true, perLetterDelay: {min: 20, max: 20}})
  //     .backspace(3)

  //   await this.typed.run();
  // }
}