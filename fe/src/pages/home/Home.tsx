import { MacroGraphs } from "../../components/Graphs/MacroGraphs";
import SlideShow from "../../components/Graphs/SlideShow";
import DatePicker from "../../components/DatePicker/DatePicker";
import { KcalGraph } from "../../components/Graphs/KcalGraph";
import FoodTable from "../../components/FoodDiary/FoodDiary";
import FloatingButton from "../../components/FloatingButton/FloatingButton";
import { RecoilRoot } from "recoil";
import './Home.css'
import '../../index.css'
import '../../Template.css'

const graphs = [
  <KcalGraph key={1} />,
  <MacroGraphs key={2} />,
];

function Home() {

  return (
    <div className="home-background">
        <RecoilRoot>
            <div>
                <DatePicker/>
            </div>
            <div>
                <SlideShow graphs={graphs} /> 
            </div>
             
            <FoodTable/>  
            <FloatingButton/> 
        </RecoilRoot>         
    </div>
  );
}

export default Home;
